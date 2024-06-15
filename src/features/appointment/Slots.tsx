import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styled from 'styled-components';
import Row from '../../components/Row';
import CopySlots from './CopySlots';
import SlotCard from './SlotCard';
import CustomizedSwitch from './CustomHolidaySwitch';
import toast from 'react-hot-toast';
import {
  createSlot,
  deleteSlot,
  displaySlots,
} from '../../services/realmServices';

const NavigationContainer = styled.div`
  background: #5a9eee3d;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

interface Slot {
  id: number;
  ObjectID: string;
  time: string;
  people: number;
  isDirty: boolean;
  date: string;
}

export default function Slots() {
  const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const selectedDate = localStorage.getItem('selectedDate');
    const currentYear = new Date().getFullYear();
    const dateWithYear = `${selectedDate} ${currentYear}`;

    const newFormattedDate = formatDate(new Date(dateWithYear));
    setFormattedDate(newFormattedDate);

    fetchSlots(newFormattedDate);
  }, []);

  const fetchSlots = async (date: string) => {
    const storedSlot = await displaySlots(date);
    console.log('🤌🤌🤌', storedSlot);

    const fetchedSlots =
      storedSlot && storedSlot.length > 0
        ? storedSlot.map((slot) => ({
            id: slot.slotNo,
            ObjectID: slot._id,
            time: slot.slotTime,
            people: slot.maxPeople,
            isDirty: false,
            date: slot.date,
          }))
        : [];

    const newSlot: Slot = {
      id: fetchedSlots.length + 1,
      ObjectID: '',
      time: '',
      people: 1,
      isDirty: true,
      date: date,
    };

    setSlots([...fetchedSlots, newSlot]);
  };

  const handleHolidayChange = () => {
    setIsHoliday(!isHoliday);
  };

  const handleTimeChange = (id: number, newTime: string) => {
    const existingSlot = slots.find((slot) => slot.time === newTime);
    if (existingSlot) {
      toast.error(
        'This time slot is already taken. Please choose another time.'
      );
      return;
    }
    setSlots(
      slots.map((slot) =>
        slot.id === id ? { ...slot, time: newTime, isDirty: true } : slot
      )
    );
  };

  const handlePeopleChange = (id: number, newPeople: number) => {
    if (newPeople < 1) {
      toast.error('People count should be greater than 0');
      return;
    }
    setSlots(
      slots.map((slot) =>
        slot.id === id ? { ...slot, people: newPeople, isDirty: true } : slot
      )
    );
  };

  const saveSlot = (id: number) => {
    const slotToSave = slots.find((slot) => slot.id === id);

    if (!slotToSave?.time) {
      toast.error('Please enter the time');
      return;
    }

    setSlots(
      slots.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              isDirty: false,
              date: formatDate(new Date(formattedDate)),
            }
          : slot
      )
    );
  };

  const handleDeleteSlot = async (ObjectID: string) => {
    try {
      await deleteSlot(ObjectID);
      const newSlots = slots.filter((slot) => slot.ObjectID !== ObjectID);
      if (newSlots.length > 0) {
        setSlots(newSlots);
      } else {
        setSlots([
          {
            id: 1,
            ObjectID: '',
            time: '',
            people: 1,  
            isDirty: true,
            date: formattedDate,
          },
        ]);
      }
      toast.success('Slot deleted successfully');
    } catch (error) {
      toast.error('Failed to delete the slot');
      console.error('Error deleting slot:', error);
    }
  };

  const addSlot = () => {
    const lastSlot = slots[slots.length - 1];
    if (lastSlot.isDirty) {
      toast.error('Please save the slot');
      return;
    }

    createSlot(lastSlot.id, lastSlot.time, lastSlot.people, lastSlot.date);

    const newSlot: Slot = {
      id: slots.length + 1,
      ObjectID: '',
      time: '',
      people: 1,
      isDirty: true,
      date: formattedDate,
    };

    setSlots([...slots, newSlot]);
  };

  const updateFormattedDate = (newDate: Date) => {
    const newFormattedDate = formatDate(new Date(newDate));
    setFormattedDate(newFormattedDate);

    fetchSlots(newFormattedDate);
  };

  const handleNextDay = () => {
    const currentDate = new Date(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    updateFormattedDate(currentDate);
  };

  const handlePreviousDay = () => {
    const currentDate = new Date(formattedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    updateFormattedDate(currentDate);
  };

  return (
    <>
      <NavigationContainer>
        <IoIosArrowBack
          onClick={handlePreviousDay}
          style={{ cursor: 'pointer' }}
        />
        <h4
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {formattedDate}
        </h4>
        <IoIosArrowForward
          onClick={handleNextDay}
          style={{ cursor: 'pointer' }}
        />
      </NavigationContainer>
      <Row type="vertical">
        <Row $contentposition="left" style={{ marginLeft: 10 }}>
          <Row style={{ fontWeight: 600, fontSize: '18px', marginLeft: 25 }}>
            Holiday <CustomizedSwitch onChange={handleHolidayChange} />
          </Row>
        </Row>
        <CopySlots />

        {!isHoliday && (
          <>
            {slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                slots={slots}
                handleTimeChange={handleTimeChange}
                handlePeopleChange={handlePeopleChange}
                saveSlot={saveSlot}
                handleDeleteSlot={handleDeleteSlot}
              />
            ))}
          </>
        )}
        <Row $contentposition="center">
          {!isHoliday && slots.length < 9 && (
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                backgroundColor: '#5A9EEE',
                fontWeight: '400',
                font: 'Helvetica',
                fontSize: '15px',
                borderRadius: '12px',
                width: '125px',
                height: '45px',
                ':hover': { backgroundColor: '#5A9EEE', color: 'white' },
              }}
              onClick={addSlot}
            >
              Add
            </Button>
          )}
        </Row>
      </Row>
    </>
  );
}
