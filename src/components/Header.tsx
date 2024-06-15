import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IoArrowBack } from 'react-icons/io5';
import { useLocation, useNavigate } from '@tanstack/react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled as muiStyled } from '@mui/material/styles';
import RouteTitle from './RouteTitle';
import { useMoveBack } from '../hooks/useMoveBack';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import { IconButton } from '@mui/material';
import ChatHeader from './ChatHeader';
import Row from './Row';

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 23px;
  font-size: 20px;
  font-weight: 400;
  font-style: Helvetica;
  color: #5a9eee;
`;

const QrButton = styled.button`
  border: none;
  background: none;
  color: black;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;

  &:hover {
    color: #555;
  }
`;

const formatRouteTitle = (pathname: string): string => {
  const title = pathname.substring(1); // remove the leading slash
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const CustomAppBar = muiStyled(AppBar)({
  boxShadow: 'none',
});
const Search = muiStyled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  height: '40px',
  backgroundColor: '#D9D9D9',
  '&:hover': {
    backgroundColor: '#D9D9D9',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: '100%',
  },
}));
const SearchIconWrapper = muiStyled('div')(({ theme }) => ({
  color: 'black',
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 1,
}));

const StyledInputBase = muiStyled(InputBase)(({ theme }) => ({
  color: '#000',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100ch',
    },
  },
}));

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeName = formatRouteTitle(location.pathname);
  const moveBack = useMoveBack();
  const [searchQuery, setSearchQuery] = useState('');
  const previousLocation = useRef(location.pathname);

  const shouldShowBackButton = ![
    '/appointments',
    '/notes',
    '/settings',
    '/',
  ].includes(location.pathname);

  const handleQrButton = () => {
    navigate({ to: '/qrscanner' });
  };
  const moveBackAndClearSearch = () => {
    navigate({ to: previousLocation.current });
    setSearchQuery('');
  };

  const isSearchPage = location.pathname === '/search';

  useEffect(() => {
    if (!isSearchPage) {
      previousLocation.current = location.pathname;
    }
  }, [isSearchPage, location.pathname]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        navigate({ to: `/search?query=${searchQuery}` });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, navigate]);

  return (
    <CustomAppBar position="static" color="transparent">
      <Toolbar>
        <HeaderContainer>
          {!isSearchPage && (
            <Row>
              <TitleContainer>
                {shouldShowBackButton && (
                  <IconButton
                    aria-label="edit"
                    size="small"
                    sx={{
                      fontSize: '20px',
                      color: 'black',
                      ':hover': {
                        background: 'none',
                      },
                    }}
                    onClick={moveBack}
                  >
                    <IoArrowBack />
                  </IconButton>
                )}
                <Title>{routeName || 'Appointments'}</Title>
              </TitleContainer>
              <Row $contentposition="right">
                <IconButton
                  aria-label="edit"
                  size="large"
                  sx={{
                    color: 'black',
                    ':hover': {
                      background: 'none',
                    },
                  }}
                >
                  {routeName === 'Chatpage' && (
                    
                      <ChatHeader />
                    
                  )}
                </IconButton>

                <IconButton
                  aria-label="edit"
                  size="small"
                  sx={{
                    color: 'black',
                    ':hover': {
                      background: 'none',
                    },
                  }}
                  onClick={handleQrButton}
                >
                  <QrButton>
                    <QrCodeRoundedIcon fontSize="inherit" />
                  </QrButton>
                </IconButton>
              </Row>
            </Row>
          )}

          {routeName !== 'Chatpage' && (
            <BottomRow>
              <Form>
                <Search>
                  <SearchIconWrapper
                    onClick={isSearchPage ? moveBackAndClearSearch : undefined}
                  >
                    {isSearchPage ? <IoArrowBack /> : <SearchIcon />}
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </Form>
            </BottomRow>
          )}
        </HeaderContainer>
        <RouteTitle />
      </Toolbar>
     
    </CustomAppBar>
  );
};

export default Header;
