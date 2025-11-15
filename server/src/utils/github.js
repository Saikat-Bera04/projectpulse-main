import axios from "axios";

export const getGitHubAccessToken = async (code) => {
    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching access token:", error.message);
        throw new Error("Failed to get access token from GitHub");
    }
};

export const getGitHubUser = async (accessToken) => {
    try {
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "ProjectPulse-App"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching GitHub user:", error.message);
        throw new Error("Failed to fetch GitHub user");
    }
};

export const getGitHubRepositories = async (accessToken) => {
    try {
        const response = await axios.get("https://api.github.com/user/repos", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "ProjectPulse-App",
                "Accept": "application/vnd.github.v3+json"
            },
            params: {
                sort: "updated",
                direction: "desc",
                per_page: 30, // Limit to 30 most recent repos for better performance
                type: "owner"
            }
        });

        // Filter out forked and archived repos, and map to include only necessary fields
        return response.data
            .filter(repo => !repo.fork && !repo.archived)
            .map(repo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                html_url: repo.html_url,
                description: repo.description,
                language: repo.language,
                updated_at: repo.updated_at,
                created_at: repo.created_at,
                owner: {
                    login: repo.owner.login,
                    avatar_url: repo.owner.avatar_url,
                    html_url: repo.owner.html_url
                },
                private: repo.private,
                fork: repo.fork,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                open_issues_count: repo.open_issues_count,
                default_branch: repo.default_branch,
                clone_url: repo.clone_url,
                ssh_url: repo.ssh_url
            }));
    } catch (error) {
        console.error("Error fetching GitHub repos:", error.response?.data || error.message);
        throw new Error("Failed to fetch GitHub repositories. Please ensure your GitHub token has the necessary permissions.");
    }
};

export const getGitHubIssues = async (accessToken) => {
    try {
        const response = await axios.get("https://api.github.com/issues", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "ProjectPulse-App"
            },
            params: {
                filter: "assigned",
                state: "open",
                sort: "updated",
                per_page: 50
            }
        });

        return response.data.map(issue => ({
            ...issue,
            repository: issue.repository_url.split('/').slice(-2).join('/')
        }));
    } catch (error) {
        console.error("Error fetching GitHub issues:", error.message);
        throw new Error("Failed to fetch GitHub issues");
    }
};

export const createGitHubIssue = async (accessToken, repository, title, body, labels = []) => {
    try {
        const response = await axios.post(`https://api.github.com/repos/${repository}/issues`, {
            title,
            body,
            labels
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "ProjectPulse-App"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error creating GitHub issue:", error.message);
        throw new Error("Failed to create GitHub issue");
    }
};

export const updateGitHubIssue = async (accessToken, repository, issueNumber, updates) => {
    try {
        const response = await axios.patch(`https://api.github.com/repos/${repository}/issues/${issueNumber}`, updates, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "User-Agent": "ProjectPulse-App"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error updating GitHub issue:", error.message);
        throw new Error("Failed to update GitHub issue");
    }
};
