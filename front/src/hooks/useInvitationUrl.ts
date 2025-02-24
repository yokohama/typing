import { useState, useEffect } from 'react';
import { UserInfo } from '@/types/userInfo';

export const useInvitationUrl = (userInfo: UserInfo | null) => {
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      const frontUrl = process.env.NEXT_PUBLIC_FRONT_URL;
      setInvitationUrl(`${frontUrl}/invitation?inviteChildUserId=${userInfo.id}`);
    }
  }, [userInfo]);

  return invitationUrl;
};
