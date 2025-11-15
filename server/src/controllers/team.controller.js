import prisma from '../config/prisma.js';
import { calculateMatchScore, generateUserEmbedding } from '../services/pinecone.service.js';

// Get AI-matched teammates
export const getMatchedTeammates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, interests, availability, limit = 20 } = req.query;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        skills: true,
        interests: true,
        availability: true,
        experience: true,
        embedding: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build where clause for filtering
    const where = {
      id: { not: userId },
    };

    if (skills) {
      where.skills = { hasSome: skills.split(',') };
    }

    if (interests) {
      where.interests = { hasSome: interests.split(',') };
    }

    if (availability) {
      where.availability = availability;
    }

    // Fetch potential matches
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        githubUsername: true,
        avatarUrl: true,
        role: true,
        skills: true,
        interests: true,
        availability: true,
        experience: true,
        bio: true,
        embedding: true,
      },
      take: parseInt(limit) * 2, // Get more for filtering
    });

    // Calculate match scores for each user
    const matchesWithScores = await Promise.all(
      users.map(async (user) => {
        const score = await calculateMatchScore(currentUser, user);
        return {
          ...user,
          matchScore: Math.round(score),
          embedding: undefined, // Don't send embeddings to client
        };
      })
    );

    // Sort by match score and take top results
    const topMatches = matchesWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit));

    res.json(topMatches);
  } catch (error) {
    console.error('Error fetching matched teammates:', error);
    res.status(500).json({ error: 'Failed to fetch matched teammates' });
  }
};

// Send team invitation
export const sendTeamInvite = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { projectId, receiverId, message } = req.body;

    // Validate required fields
    if (!projectId || !receiverId) {
      return res.status(400).json({ error: 'Project ID and receiver ID are required' });
    }

    // Verify project exists and sender has permission
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: senderId },
          {
            members: {
              some: {
                userId: senderId,
                role: { in: ['owner', 'admin'] },
              },
            },
          },
        ],
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Check if invite already exists
    const existingInvite = await prisma.teamInvite.findFirst({
      where: {
        projectId,
        receiverId,
        status: 'pending',
      },
    });

    if (existingInvite) {
      return res.status(400).json({ error: 'Invite already sent to this user' });
    }

    // Create invite
    const invite = await prisma.teamInvite.create({
      data: {
        projectId,
        senderId,
        receiverId,
        message,
        status: 'pending',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'invite_received',
        title: 'Team Invitation',
        message: `${req.user.name} invited you to join "${project.name}"`,
        link: `/invites/${invite.id}`,
        userId: receiverId,
      },
    });

    res.status(201).json(invite);
  } catch (error) {
    console.error('Error sending team invite:', error);
    res.status(500).json({ error: 'Failed to send team invite' });
  }
};

// Get user's invites
export const getUserInvites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    };

    if (status) {
      where.status = status;
    }

    const invites = await prisma.teamInvite.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            githubUsername: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
};

// Respond to team invite
export const respondToInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const userId = req.user.id;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "accept" or "reject"' });
    }

    // Find invite
    const invite = await prisma.teamInvite.findFirst({
      where: {
        id,
        receiverId: userId,
        status: 'pending',
      },
      include: {
        project: true,
      },
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found or already responded' });
    }

    // Update invite status
    const updatedInvite = await prisma.teamInvite.update({
      where: { id },
      data: {
        status: action === 'accept' ? 'accepted' : 'rejected',
        respondedAt: new Date(),
      },
    });

    // If accepted, add user as project member
    if (action === 'accept') {
      await prisma.projectMember.create({
        data: {
          projectId: invite.projectId,
          userId,
          role: 'member',
        },
      });

      // Create activity log
      await prisma.activity.create({
        data: {
          type: 'member_joined',
          description: `${req.user.name} joined the project`,
          projectId: invite.projectId,
          userId,
        },
      });

      // Notify sender
      await prisma.notification.create({
        data: {
          type: 'invite_accepted',
          title: 'Invite Accepted',
          message: `${req.user.name} accepted your invitation to join "${invite.project.name}"`,
          link: `/project/${invite.projectId}`,
          userId: invite.senderId,
        },
      });
    }

    res.json({
      message: `Invite ${action}ed successfully`,
      invite: updatedInvite,
    });
  } catch (error) {
    console.error('Error responding to invite:', error);
    res.status(500).json({ error: 'Failed to respond to invite' });
  }
};

// Update user profile for better matching
export const updateMatchingProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, interests, availability, experience, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        skills,
        interests,
        availability,
        experience,
        bio,
      },
    });

    // Generate new embedding for updated profile
    try {
      const embedding = await generateUserEmbedding(updatedUser);
      await prisma.user.update({
        where: { id: userId },
        data: { embedding },
      });
    } catch (embeddingError) {
      console.error('Error generating embedding:', embeddingError);
      // Continue even if embedding generation fails
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
        availability: updatedUser.availability,
        experience: updatedUser.experience,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error('Error updating matching profile:', error);
    res.status(500).json({ error: 'Failed to update matching profile' });
  }
};
