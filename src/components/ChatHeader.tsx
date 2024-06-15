import React, { useState } from 'react';
import { IoArrowUp, IoArrowDown } from 'react-icons/io5';
import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Modal from './Modal';
import Calendar from './Calendar';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { CiSearch } from 'react-icons/ci';

const Search = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  height: '40px',
  backgroundColor: '#D9D9D9',
  display: 'flex',
  
  // marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
  },
}));

const StyledInputBase = styled(InputBase)<{ isDisabled: boolean }>`
  color: '#000';
  width: 100%;
  height: 100%;
  padding: 10px 10px 10px 10px;
  ${({ isDisabled }) => isDisabled && `background-color: #ddd;`}
`;

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleScrollUp = () => {
    setScrollTop(scrollTop - 100);
    console.log('scrolling down');
  };

  const handleScrollDown = () => {
    setScrollTop(scrollTop + 100);
    console.log('scrolling up');
  };

  const handleClick = () => {
    console.log('clicked');
    setIsVisible(!isVisible);
    setIsSearchDisabled(true);
  };

  return (
    <AppBar position="static" color="transparent" style={{ boxShadow: 'none' }}>
      {isVisible ? (
        <CiSearch onClick={handleClick} />
      ) : (
        // <Toolbar sx={{ display: 'block' }}>
        <Search>
          
          <IconButton>
            <KeyboardBackspaceOutlinedIcon
              
              onClick={() => setIsVisible(true)}
            />
          </IconButton>
          <StyledInputBase
            placeholder="Search chat..."
            value={searchQuery}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search' }}
            fullWidth
            isDisabled={isSearchDisabled}
          />
          <Modal>
            <Modal.Open opens="calendar">
              <IconButton aria-label="calendar">
                <CalendarTodayIcon fontSize="inherit" />
              </IconButton>
            </Modal.Open>
            <Modal.Window name="calendar">
              <Calendar />
            </Modal.Window>
          </Modal>
          <IconButton aria-label="up" onClick={handleScrollUp}>
            <IoArrowUp />
          </IconButton>
          <IconButton aria-label="down" onClick={handleScrollDown}>
            <IoArrowDown />
          </IconButton>
        </Search>
        // </Toolbar>
      )}
    </AppBar>
  );
};

export default Header;

