import React, { useState } from 'react';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  FaceSmileIcon,
  CalendarIcon,
  GlobeAltIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Badge } from '../ui/Badge';

interface PlatformInfo {
  name: string;
  icon: string;
  characterLimit: number;
  enabled: boolean;
  color: string;
}

const platforms: PlatformInfo[] = [
  { name: 'Facebook', icon: '📘', characterLimit: 63206, enabled: true, color: 'bg-blue-500' },
  { name: 'Instagram', icon: '📷', characterLimit: 2200, enabled: true, color: 'bg-pink-500' },
  { name: 'WhatsApp', icon: '💬', characterLimit: 4096, enabled: false, color: 'bg-green-500' },
  { name: 'YouTube', icon: '📹', characterLimit: 5000, enabled: false, color: 'bg-red-500' },
];

export const PostComposer: React.FC = () => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Facebook', 'Instagram']);
  const [isScheduled, setIsScheduled] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const togglePlatform = (platformName: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformName) 
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getCharacterCount = (platform: string) => {
    const platformInfo = platforms.find(p => p.name === platform);
    return platformInfo ? Math.min(content.length, platformInfo.characterLimit) : 0;
  };

  const getCharacterLimit = (platform: string) => {
    return platforms.find(p => p.name === platform)?.characterLimit || 0;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Text Content */}
        <div>
          <Textarea
            placeholder="What's on your mind? Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] text-base resize-none"
          />
        </div>

        {/* Media Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="media-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Add photos or videos
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  PNG, JPG, GIF, MP4 up to 10MB
                </span>
                <input
                  id="media-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={handleMediaUpload}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Platform Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Select Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                onClick={() => platform.enabled && togglePlatform(platform.name)}
                className={`
                  relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${selectedPlatforms.includes(platform.name)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${!platform.enabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {platform.name}
                    </p>
                    {selectedPlatforms.includes(platform.name) && (
                      <p className="text-xs text-gray-500">
                        {getCharacterCount(platform.name)}/{getCharacterLimit(platform.name)}
                      </p>
                    )}
                  </div>
                </div>
                {selectedPlatforms.includes(platform.name) && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  </div>
                )}
                {!platform.enabled && (
                  <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                    Soon
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Character Count for Selected Platforms */}
        {selectedPlatforms.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Character Count</h4>
            <div className="flex flex-wrap gap-2">
              {selectedPlatforms.map((platform) => {
                const count = getCharacterCount(platform);
                const limit = getCharacterLimit(platform);
                const isOverLimit = count > limit;
                
                return (
                  <div
                    key={platform}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm
                      ${isOverLimit ? 'bg-error-50 text-error-700' : 'bg-gray-100 text-gray-700'}
                    `}
                  >
                    <span>{platforms.find(p => p.name === platform)?.icon}</span>
                    <span className={isOverLimit ? 'font-medium' : ''}>
                      {count}/{limit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scheduling Options */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Schedule Post</p>
              <p className="text-xs text-gray-500">Choose when to publish</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isScheduled ? "outline" : "default"}
              size="sm"
              onClick={() => setIsScheduled(false)}
            >
              <GlobeAltIcon className="h-4 w-4 mr-1" />
              Post Now
            </Button>
            <Button
              variant={isScheduled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsScheduled(true)}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>

        {isScheduled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <FaceSmileIcon className="h-4 w-4 mr-1" />
            Emoji
          </Button>
          <Button variant="ghost" size="sm">
            Preview
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">Save Draft</Button>
          <Button disabled={selectedPlatforms.length === 0 || !content.trim()}>
            {isScheduled ? 'Schedule Post' : 'Post Now'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};