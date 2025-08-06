import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface SocialAccount {
  id: string;
  platform: string;
  platformIcon: string;
  username: string;
  displayName: string;
  followers: number;
  avatar: string;
  status: 'connected' | 'disconnected' | 'expired' | 'pending';
  lastSync: string;
  accountType: string;
}

const mockAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'Facebook',
    platformIcon: '📘',
    username: '@mybusiness',
    displayName: 'My Business Page',
    followers: 12500,
    avatar: '/api/placeholder/40/40',
    status: 'connected',
    lastSync: '2 minutes ago',
    accountType: 'Business Page'
  },
  {
    id: '2',
    platform: 'Instagram',
    platformIcon: '📷',
    username: '@mycompany',
    displayName: 'My Company',
    followers: 8900,
    avatar: '/api/placeholder/40/40',
    status: 'connected',
    lastSync: '5 minutes ago',
    accountType: 'Business Account'
  },
  {
    id: '3',
    platform: 'WhatsApp',
    platformIcon: '💬',
    username: '+1234567890',
    displayName: 'Business WhatsApp',
    followers: 0,
    avatar: '/api/placeholder/40/40',
    status: 'expired',
    lastSync: '2 days ago',
    accountType: 'Business API'
  },
  {
    id: '4',
    platform: 'YouTube',
    platformIcon: '📹',
    username: '@mychannel',
    displayName: 'My Channel',
    followers: 5600,
    avatar: '/api/placeholder/40/40',
    status: 'disconnected',
    lastSync: 'Never',
    accountType: 'Channel'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'connected':
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircleIcon className="h-3 w-3" />
        Connected
      </Badge>;
    case 'expired':
      return <Badge variant="warning" className="flex items-center gap-1">
        <ExclamationTriangleIcon className="h-3 w-3" />
        Expired
      </Badge>;
    case 'disconnected':
      return <Badge variant="error" className="flex items-center gap-1">
        <XCircleIcon className="h-3 w-3" />
        Disconnected
      </Badge>;
    case 'pending':
      return <Badge variant="secondary" className="flex items-center gap-1">
        <ArrowPathIcon className="h-3 w-3 animate-spin" />
        Connecting...
      </Badge>;
    default:
      return null;
  }
};

const formatFollowers = (count: number) => {
  if (count === 0) return 'N/A';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

interface AccountCardProps {
  account: SocialAccount;
  onRefresh: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSettings: (id: string) => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ 
  account, 
  onRefresh, 
  onDisconnect, 
  onSettings 
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xl">{account.platformIcon}</span>
              </div>
              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white
                ${account.status === 'connected' ? 'bg-success-500' : 
                  account.status === 'expired' ? 'bg-warning-500' : 'bg-error-500'}`} 
              />
            </div>
            <div>
              <CardTitle className="text-base">{account.platform}</CardTitle>
              <p className="text-sm text-gray-500">{account.accountType}</p>
            </div>
          </div>
          {getStatusBadge(account.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium text-gray-900">{account.displayName}</p>
          <p className="text-sm text-gray-500">{account.username}</p>
        </div>
        
        {account.followers > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Followers</span>
            <span className="font-medium text-gray-900">
              {formatFollowers(account.followers)}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last sync</span>
          <span className="text-gray-900">{account.lastSync}</span>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onRefresh(account.id)}
            disabled={account.status === 'pending'}
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onSettings(account.id)}
          >
            <Cog6ToothIcon className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDisconnect(account.id)}
            className="text-error-600 hover:text-error-700 hover:bg-error-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = React.useState(mockAccounts);

  const handleRefresh = (id: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === id 
        ? { ...account, status: 'pending' as const }
        : account
    ));
    
    // Simulate API call
    setTimeout(() => {
      setAccounts(prev => prev.map(account => 
        account.id === id 
          ? { ...account, status: 'connected' as const, lastSync: 'Just now' }
          : account
      ));
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === id 
        ? { ...account, status: 'disconnected' as const }
        : account
    ));
  };

  const handleSettings = (id: string) => {
    console.log('Settings for account:', id);
  };

  const connectedCount = accounts.filter(acc => acc.status === 'connected').length;
  const totalCount = accounts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Connected Accounts</h2>
          <p className="text-gray-500">
            {connectedCount} of {totalCount} accounts connected
          </p>
        </div>
        <Button>Add Account</Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onRefresh={handleRefresh}
            onDisconnect={handleDisconnect}
            onSettings={handleSettings}
          />
        ))}
        
        {/* Add New Account Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">+</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Add New Account</h3>
            <p className="text-xs text-gray-500">
              Connect your social media accounts to start posting
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};