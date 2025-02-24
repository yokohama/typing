// "use client";

// import React, { useEffect, useState } from 'react';

// import { fetchData } from '@/lib/api';
// import { useUser } from '@/context/UserContext';
// import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
// import { Relation } from '@/types/pair';

// import { QrCode } from './components/QrCode';
// import { PairTable } from '@/app/pair/components/PairTable';
// import { GiftRequest } from '@/app/pair/components/GiftRequest';

// import { SelectedRelation } from '@/types/pair';

// /*
//  * TODO:
//  * user_idで招待をしてしまっているので、IDoor問題あり。
//  * user_idではなく、都度APIをたたいてトークンをparents_childrenに生成。
//  * 有効期限もつけ、有効な間だけここに表示。
//  */
// export default function Page() {
//   const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/pairs`;
//   const frontUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}`;

//   const { userInfo } = useUser();
//   const [relations, setRelations] = useState<Relation[]>([]);
//   const [invitationUrl, setInvitationUrl] = useState<string | undefined | null>(null);

//   const [isShowModal, setIsShowModal] = useState<boolean>(false);
//   const [selectedRelation, setSelectedRelation] = useState<SelectedRelation | null>(null); 

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const data = await fetchData<Relation[] | ErrorResponse>(endpoint, 'GET');

//       if (isErrorResponse(data)) {
//         console.error('Error fetching user data:', data.message);
//         return;
//       }

//       console.log(data);

//       setRelations(data);
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (userInfo) {
//       setInvitationUrl(`${frontUrl}/invitation?inviteChildUserId=${userInfo?.id}`);
//     }
//   }, [userInfo]);

//   useEffect(() => {
//     console.log(isShowModal);
//   }, [isShowModal]);

//   return(
//     <>
//       {isShowModal && selectedRelation
//         ? <GiftRequest
//             parentUserId={selectedRelation.parentUserId} 
//             parentUserName={selectedRelation.parentUserName} 
//             isShowModal={isShowModal}
//             setIsShowModal={setIsShowModal}
//           />
//         :
//           <>
//             <QrCode invitationUrl={invitationUrl} />
//             <PairTable
//               relations={relations}
//               setSelectedRelation={setSelectedRelation}
//               setIsShowModal={setIsShowModal}
//             />
//           </>
//       }
//     </>
//   );
// }
"use client";
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { QrCode } from './components/QrCode';
import { PairTable } from '@/app/pair/components/PairTable';
import { GiftRequest } from '@/app/pair/components/GiftRequest';
import { SelectedRelation } from '@/types/pair';
import { usePairRelations } from '@/hooks/usePairRelations';
import { useInvitationUrl } from '@/hooks/useInvitationUrl';

export default function Page() {
  const { userInfo } = useUser();
  const { relations, isLoading, error } = usePairRelations();
  const invitationUrl = useInvitationUrl(userInfo);
  
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<SelectedRelation | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isShowModal && selectedRelation ? (
        <GiftRequest
          parentUserId={selectedRelation.parentUserId}
          parentUserName={selectedRelation.parentUserName}
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
        />
      ) : (
        <>
          <QrCode invitationUrl={invitationUrl} />
          <PairTable
            relations={relations}
            setSelectedRelation={setSelectedRelation}
            setIsShowModal={setIsShowModal}
          />
        </>
      )}
    </>
  );
}
