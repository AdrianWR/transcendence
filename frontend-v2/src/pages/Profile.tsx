import { Flex } from '@mantine/core';
import { FCWithLayout } from '../App';
import ProfileCard from '../components/Profile/ProfileCard';

const Profile: FCWithLayout = () => {
  return (
    <Flex
      style={{ flex: 1 }}
      direction={{ base: 'column', sm: 'row' }}
      justify='space-around'
      align='center'
      mx={32}
      p={{ base: 32, sm: 0 }}
    >
      <ProfileCard />
    </Flex>
  );
};

export default Profile;
