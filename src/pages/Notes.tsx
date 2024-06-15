import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import FixedAddButton from '../components/FixedAddButton';
import UserAvatar from '../components/UserAvatar';
import Row from '../components/Row';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { useEffect } from 'react';
import { displayContacts } from '../services/realmServices';
import { User } from '../services/types';

const Content = styled.div`
  font-family: Helvetica;
  font-size: 11.5px;
  font-weight: 400;
  line-height: 13.22px;
  margin-top: -25px;
  margin-left: 67px;
  text-transform:none;
  color: #000;
`;

export default function Notes() {
  const navigate = useNavigate();
  const [result, setResult] = useState<User[]>([]);
  const handleClick = () => {
    navigate({ to: '/newContacts' });
  };
  useEffect(() => {
    async function fetchContacts() {
      const data = await displayContacts();
      if(data==null) return;
      setResult(data);

    }
    fetchContacts();
    
  }, []);
  return (
    <>
      {result?.map((item, index) => (
        <Row key={index} style={{marginBottom:-30}}>
          <Button
            sx={{ width: '100%' }}
            onClick={() => navigate({ to: '/chatpage' })}
          >
            <Row style={{ cursor: 'pointer', width: '100%' }}>
              <Row type="vertical">
                <Row>
                  <UserAvatar name={item.name} mobile={item.phone} />
                </Row>

                <Content style={{ padding: '7px 2px ' }}>
                  hello edhbqhjb bjhdbqjhb
                </Content>
              </Row>
              <Row
                type="vertical"
                style={{
                  marginTop: -50,
                  fontSize: 12,
                  color: 'black',
                }}
              >
                10:00 AM
              </Row>
            </Row>
          </Button>
          <FixedAddButton onClick={handleClick} />
        </Row>
      ))}
    </>
  );
}
