import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

// Will go into a FlatList
// Key is ID
// Fetch specific message by ID and render its contents, check emailPage for reference
// emailPage itself will only be effectively a 'container'

// The new emailPage will also have to fetch the thread in question (by id)
// Then get the messageID array
// Pass it to EmailBlock by FlatList key

// NEW
// Send body to back end, clean it, classify it, and return it as string for display
// Probably learn how to render html server side and return it? Might work with the web version?

// Add options
// Move to folder: Move to button opens a drop down of folders, called by API
// API call can probably be part of the emailPage useEffect
// gets array of folders, get name and id
// Send messageID and folderID to backend with function

// Reply: Open stack compose page
// Send sender email and name as params
// Compose page will have a if to check if we have localparams
// (Maybe even simply have 2 compose pages? we'll see)

// NEW NEW
// Create a renderHtml right here
// Accepts a link param
// With an appended message id
// Sends it to a backend
// Which requests another route, sending it again as an args
// Which pulls a message
// Jsonifies it
// First route accepts the jsonified PAGE
// It is now workable. Get the body

const convertUnixToDate = (unixTimestamp: any) => {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options); // Format date based on locale
};

const EmailItem = ({messageID}: any) => {
    const [email, setEmail] = useState();
    const [isLoading, setLoading] = useState(true);
    const [formattedDate, setFormattedDate] = useState('');

    const getEmail = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/nylas/get-email?id=${messageID}`);
          const json = await response.json();
          setEmail(json[0]); // Set the fetched data

          // @ts-ignore
          const tempFormattedDate = convertUnixToDate(email.date);
          setFormattedDate(tempFormattedDate);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false once done
        }
      };

    useEffect(() => {
        getEmail();
        }, []);

  if (isLoading) {
        // Show a loading spinner while data is being fetched
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        );
    }

  return (
    <View style={styles.container}>
      {/* Top Section for Buttons */}

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.buttonSection}>
          <Text style={[styles.button, {backgroundColor: '#FAA0A0'}]}>
            <Text style={{color: 'black', borderRadius: 8}}>Label</Text>
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Forward</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Email Details Section */}
      <View style={styles.detailsSection}>
        <Text style={styles.subject}>{email.subject}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.sender}>
          From: {email.from_[0].name} ({email.from_[0].email})
        </Text>
        <Text style={styles.receiver}>To: {email.to[0].email}</Text>
        {/* <Text style={styles.body}>{email.body}</Text> */}
        <iframe srcDoc={`${email.body}`} style={{border: 'none', height: 500}} />
      </View>
    </View>
  )
}

export default EmailItem

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsSection: {
    marginTop: 10,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  sender: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  receiver: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});