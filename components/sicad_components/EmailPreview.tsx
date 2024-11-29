import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const convertUnixToDate = (unixTimestamp: any) => {
  const date = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options); // Format date based on locale
};

const EmailPreview = ({ item }: any) => {

  const formattedDate = convertUnixToDate(item.latest_message_received_date);
  const threadID = item.id;

    return (
    <TouchableOpacity
        onPress={() => {router.push({
            // @ts-ignore
            pathname: 'sicad_version/email/[emailPage]',
            // @ts-ignore
            params: {
                threadID,
            }
        })}}
        style={styles.card}
    >
        <View style={styles.content}>
        {/* Name and Date */}
        <View style={styles.header}>
            <Text style={styles.name}>{item.latest_draft_or_message.from_[0].name} <Text style={styles.preview}>{(item.message_ids.length > 1) ? item.message_ids.length : ''}</Text></Text>
            <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Subject and Classifier */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={{backgroundColor: '#FAA0A0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8}}>Label</Text>
        </View>

        {/* Preview Text */}
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.preview}>{item.snippet}</Text>
        </View>

    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#999',
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  preview: {
    fontSize: 16,
    color: '#777',
  },
  star: {
    marginLeft: 10,
  },
});

export default EmailPreview;
