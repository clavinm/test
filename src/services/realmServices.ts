import { app } from '../constants';
import toast from 'react-hot-toast';
// import BSON from 'realm-web';
import BSON from 'bson';

async function createUser(userData: object) {
  try {
    const user = app.currentUser;
    if (user === null) return;

    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Contacts');
    const doctorCollection = mongodb.db('user-account').collection('Doctors');

    const doctor = await doctorCollection.findOne();
    const doctors = doctor._id.toString();

    userData = {
      ...userData,
      doctor: doctors,
    };

    await usersCollection.insertOne(userData);
    console.log('User created successfully:', userData);
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
  }
}

async function searchUser(searchQuery: string) {
  try {
    const user = app.currentUser;
    if (user === null) return null;

    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Contacts');
    const pattern = searchQuery;

    const result = await usersCollection.find({
      name: { $regex: pattern, $options: 'i' },
    });

    return result;
  } catch (error) {
    console.error('Error searching user:', error);
    // toast.error('Failed to search user');
    throw error;
  }
}

async function searchDoctors(id: string) {
  try {
    const user = app.currentUser;
    if (user === null) return null;

    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Doctors');
    const pattern = id;

    const result = await usersCollection.find({ loginKey: pattern });

    return result;
  } catch (error) {
    console.error('Error searching doctors:', error);
    // toast.error('Failed to search doctors');
    throw error;
  }
}
async function displayContacts() {
  const user = app.currentUser;
  try {
    if (user === null) return;
    const mongodb = user.mongoClient('mongodb-atlas');
    const studentsCollection = mongodb
      .db('user-account')
      .collection('Contacts');
    
    try {
      const result = await studentsCollection.find();

      
      return result;
    } catch (error) {
      toast.error('Failed to Fetch Contacts');
      console.error('Error while performing fetch Contacts', error);
      throw error;
    }
  } catch (error) {
    toast.error('Failed to Connect Database');
    console.error('Error while performing display function:', error);
    throw error;
  }
}

async function createSlot(
  id: number,
  slotTime: string,
  maxPeople: number,
  date: string
) {
  const user = app.currentUser;
  const currentDate = new Date();
  const dateObject = new Date(date);

  const slotDocument = {
    slotNo: id,
    date: dateObject,
    createdAt: currentDate,
    updatedAt: currentDate,
    slotTime: slotTime,
    maxPeople: maxPeople,
    isDeleted: false,
  };
  console.log(slotDocument);

  try {
    if (user === null) return;
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotCollection = mongodb.db('user-account').collection('Slots');
    await slotCollection.insertOne(slotDocument);
    toast.success('Slot created successfully');
    console.log('Slot created successfully:', slotDocument);
  } catch (error) {
    toast.error('Failed to create slot');
    console.error('Error creating slot:', error);
    throw error;
  }
}

async function displaySlots(date: string) {
  const user = app.currentUser;
const dateObject = new Date(date);
  if (!user) {
    console.error('User is not authenticated');
    return [];
  }

  const mongodb = user.mongoClient('mongodb-atlas');
  const slotCollection = mongodb.db('user-account').collection('Slots');

  try {
    const slots = await slotCollection.find({ date: dateObject });
    return slots;
  } catch (error) {
    console.error('Error fetching slots:', error);
    return [];
  }
}

async function editSlots(id:number, newMaxPeople:number) {
  try {
    const user = app.currentUser;
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotCollection = mongodb.db('user-account').collection('Slots');

    const objectId = new BSON.ObjectId(id);
    try {
      const result = await slotCollection.findOne({ _id: objectId });

      if (!result) {
        throw new Error('Slot not found.');
      }

      const updateResult = await slotCollection.updateOne(
        { _id: objectId },
        { $set: { maxPeople: newMaxPeople, updatedAt: new Date() } }
      );

      console.log('search result', updateResult);
    } catch (error) {
      console.error('Error while fetching slots collections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error while performing displaySlots function :', error);
    throw error;
  }
}
async function deleteSlot(id:string) {
  try {
     const user = app.currentUser;
     if (!user) {
       console.error('User is not authenticated');
       return;
     }
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotCollection = mongodb.db('user-account').collection('Slots');

    const objectId = new BSON.ObjectId(id);

    try {
      const result = await slotCollection.findOne({ _id: objectId });

      if (!result) {
        throw new Error('Slot not found.');
      }

      const deleteResult = await slotCollection.deleteOne({ _id: objectId });

      if (deleteResult.deletedCount === 1) {
        console.log('Slot deleted successfully.');
      } else {
        console.log('Slot not deleted.');
      }
    } catch (error) {
      console.error('Error while fetching slots collections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error while performing deleteSlot function:', error);
    throw error;
  }
}
export {
  createUser,
  searchUser,
  searchDoctors,
  displayContacts,
  createSlot,
  displaySlots,
  deleteSlot,
  editSlots,
};
