import React, { useState } from 'react';
import { 
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TrashIcon,
  CloudArrowUpIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'gif';
  size: number;
  url: string;
  thumbnail: string;
  uploadDate: string;
  dimensions: { width: number; height: number };
  usedInPosts: number;
}

const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'product-hero.jpg',
    type: 'image',
    size: 2500000,
    url: '/api/placeholder/400/300',
    thumbnail: '/api/placeholder/200/150',
    uploadDate: '2024-01-15',
    dimensions: { width: 1920, height: 1080 },
    usedInPosts: 3
  },
  {
    id: '2',
    name: 'brand-video.mp4',
    type: 'video',
    size: 15000000,
    url: '/api/placeholder/400/300',
    thumbnail: '/api/placeholder/200/150',
    uploadDate: '2024-01-14',
    dimensions: { width: 1920, height: 1080 },
    usedInPosts: 1
  },
  {
    id: '3',
    name: 'celebration.gif',
    type: 'gif',
    size: 800000,
    url: '/api/placeholder/400/300',
    thumbnail: '/api/placeholder/200/150',
    uploadDate: '2024-01-13',
    dimensions: { width: 500, height: 500 },
    usedInPosts: 2
  },
  {
    id: '4',
    name: 'team-photo.jpg',
    type: 'image',
    size: 1800000,
    url: '/api/placeholder/400/300',
    thumbnail: '/api/placeholder/200/150',
    uploadDate: '2024-01-12',
    dimensions: { width: 1600, height: 900 },
    usedInPosts: 0
  },
  {
    id: '5',
    name: 'tutorial-demo.mp4',
    type: 'video',
    size: 22000000,
    url: '/api/placeholder/400/300',
    thumbnail: '/api/placeholder/200/150',
    uploadDate: '2024-01-11',
    dimensions: { width: 1920, height: 1080 },
    usedInPosts: 1
  },
  {
    id: '6',
    name: 'logo-animation.gif',
    type: 'gif',
    size: 600000,
    url: '/api/placeholder/400/300',
    thumbnail: '/api/placeholder/200/150',
    uploadDate: '2024-01-10',
    dimensions: { width: 400, height: 400 },
    usedInPosts: 5
  }
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <PhotoIcon className="h-5 w-5" />;
    case 'video':
      return <VideoCameraIcon className="h-5 w-5" />;
    case 'gif':
      return <DocumentIcon className="h-5 w-5" />;
    default:
      return <DocumentIcon className="h-5 w-5" />;
  }
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'image':
      return 'bg-blue-100 text-blue-800';
    case 'video':
      return 'bg-purple-100 text-purple-800';
    case 'gif':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface MediaCardProps {
  file: MediaFile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPreview: (file: MediaFile) => void;
  onDelete: (id: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  file, 
  isSelected, 
  onSelect, 
  onPreview, 
  onDelete 
}) => {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
    }`}>
      <div className="aspect-video relative bg-gray-100">
        <img
          src={file.thumbnail}
          alt={file.name}
          className="w-full h-full object-cover"
        />
        
        {/* File type indicator */}
        <div className="absolute top-2 left-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(file.type)}`}>
            {getFileIcon(file.type)}
            <span className="uppercase">{file.type}</span>
          </div>
        </div>
        
        {/* Selection checkbox */}
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(file.id)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onPreview(file)}
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
            >
              <ShareIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="error"
              onClick={() => onDelete(file.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm text-gray-900 truncate" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{formatFileSize(file.size)}</span>
          <span>{file.dimensions.width}×{file.dimensions.height}</span>
        </div>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
          <span>{file.usedInPosts} posts</span>
        </div>
      </CardContent>
    </Card>
  );
};

export const MediaLibrary: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState(mockMediaFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'gif'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSelectFile = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleDeleteSelected = () => {
    setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
  };

  const handlePreview = (file: MediaFile) => {
    console.log('Preview file:', file);
  };

  const handleDelete = (id: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
    setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Upload files:', files);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-500">
            {mediaFiles.length} files • {formatFileSize(mediaFiles.reduce((total, file) => total + file.size, 0))}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="sr-only"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span className="cursor-pointer">
                <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                Upload Media
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="gif">GIFs</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="border-none"
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="border-none"
                >
                  <ListBulletIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-primary-50 rounded-md">
              <span className="text-sm text-primary-700">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button variant="error" size="sm" onClick={handleDeleteSelected}>
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredFiles.map((file) => (
            <MediaCard
              key={file.id}
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={handleSelectFile}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => handleSelectFile(file.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img src={file.thumbnail} alt={file.name} className="h-10 w-10 rounded object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getTypeBadgeColor(file.type)}>
                          {file.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.dimensions.width}×{file.dimensions.height}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.usedInPosts} posts
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handlePreview(file)}>
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <ShareIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(file.id)} className="text-error-600">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">No media files found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters.' : 'Upload some media files to get started.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};