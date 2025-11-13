import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export default function ExtensionPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-sm rounded-lg bg-gray-900 text-white shadow-2xl font-code">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold text-center">ProjectPulse for VS Code</h1>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Project</label>
            <Select>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="proj1">AI for Education</SelectItem>
                <SelectItem value="proj2">Mobile App Dev</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Your Tasks</label>
            <div className="space-y-2 p-3 rounded-md border border-gray-700 bg-gray-800 h-48 overflow-y-auto">
              <div className="p-2 rounded bg-gray-700/50">
                <p className="text-sm">[FEAT] Develop API for team matching</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="p-2 rounded bg-gray-700/50">
                <p className="text-sm">[DOCS] Write documentation for Kanban component</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
            </div>
          </div>
          
          <RainbowButton className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync with ProjectPulse
          </RainbowButton>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-center text-gray-500">
            Placeholder for issue updates and notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
