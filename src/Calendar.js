import React from 'react'
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import * as Calendar from 'expo-calendar';


export default function CalendarComponent() {
  const [selectedStartDate, setSelectedStartDate] = React.useState(null);
  const [friendNameText, setFriendNameText] = React.useState('');
  const startDate = selectedStartDate ? selectedStartDate.format('YYYY-MM-DD').toString() : '';

  React.useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

async function getDefaultCalendarSource() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendars = calendars.filter(
    (each) => each.source.name === 'Default'
  );
  return defaultCalendars.length
    ? defaultCalendars[0].source
    : calendars[0].source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
  return newCalendarID;
}


const addNewEvent = async () => {
    try {
      const calendarId = await createCalendar();
      
      const res = await Calendar.createEventAsync(calendarId, {
        endDate: getAppointementDate(startDate),
        startDate: getAppointementDate(startDate),
        title: 'Happy Birthday buddy ' + friendNameText,
      });
      Alert.alert('Event Created!');
    } catch (e) {
      console.log(e);
    }
  }; 


  return (
    <View style={styles.container}>
    <TextInput
        onChangeText={setFriendNameText}
        value={friendNameText}
        placeholder="Enter the name of your friend"
        style={styles.input}
      />
      <CalendarPicker onDateChange={setSelectedStartDate} />
      <Text>{}</Text>
      <Text style={styles.dateText}>{startDate}</Text>
      <Button style={{borderRadius:7,}} title={"Add to calendar"} onPress={addNewEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding:24,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius:5,
    width:250,
  },
  dateText: {
    margin: 16,
  },
});
