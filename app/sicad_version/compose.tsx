import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const ComposeEmail = () => {
  const [fromEmail, setFromEmail] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    // Handle sending email
    Alert.alert('Send', `Sending email from: ${fromEmail}, to: ${toEmail}`);
  };

  const handleAddAttachment = () => {
    // Handle adding attachments
    Alert.alert('Attachment', 'Add attachment clicked!');
  };

  const handleEllipsis = () => {
    // Handle additional options
    Alert.alert('More Options', 'Ellipsis clicked!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAddAttachment} style={styles.icon}>
          <Text>Pressable icons go here</Text>
        </TouchableOpacity>
      </View>

      {/* Email Fields */}
      <View style={styles.field}>
        <Text style={styles.label}>From:</Text>
        <TextInput
          style={styles.input}
          placeholder="Your email"
          value={fromEmail}
          onChangeText={setFromEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>To:</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipient's email"
          value={toEmail}
          onChangeText={setToEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
        />
      </View>
      <View style={styles.bodyField}>
        <TextInput
          style={[styles.input, styles.bodyInput]}
          placeholder="Write your email here..."
          value={body}
          onChangeText={setBody}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginLeft: 32
  },
  field: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  bodyField: {
    flex: 1,
    marginTop: 10,
  },
  bodyInput: {
    height: '100%',
    textAlignVertical: 'top', // For proper alignment of multiline input
  },
});

export default ComposeEmail;
