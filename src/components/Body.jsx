import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const Body = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const currentUserId = socket.id;
  console.log("currentUserId: ", currentUserId);
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connected as: ${socket.id}`);
    });
    socket.on("updateUserList", (users) => {
      setConnectedUsers(users.filter((user) => user !== socket.id));
    });
    socket.on("receiveMessage", (messageData) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [messageData.sender]: [
          ...(prevMessages[messageData.sender] || []),
          { type: "received", text: messageData.text },
        ],
      }));
    });
    socket.on("callUser", ({ from, callType }) => {
      setIncomingCall({ from, callType });
    });
    return () => {
      socket.off("updateUserList");
      socket.off("receiveMessage");
      socket.off("callUser");
    };
  }, []);
  const handleUserClick = (user) => {
    setActiveUser(user);
    if (!messages[user]) {
      setMessages({ ...messages, [user]: [] });
    }
  };
  const handleSendMessage = () => {
    if (currentMessage.trim() !== "" && activeUser) {
      const messageData = {
        sender: socket.id,
        recipientId: activeUser,
        text: currentMessage,
      };
      socket.emit("sendMessage", messageData);
      setMessages({
        ...messages,
        [activeUser]: [
          ...(messages[activeUser] || []),
          { type: "sent", text: currentMessage },
        ],
      });
      setCurrentMessage("");
    }
  };
  const handleCall = (type) => {
    if (activeUser) {
      socket.emit("callUser", { recipientId: activeUser, callType: type });
    }
  };
  const handleAcceptCall = () => {
    alert(`Accepted ${incomingCall.callType} call from ${incomingCall.from}`);
    setIncomingCall(null);
  };
  const handleRejectCall = () => {
    alert(`Rejected ${incomingCall.callType} call from ${incomingCall.from}`);
    setIncomingCall(null);
  };
  return (
    <Box>
      <Typography variant="h4">My Id: {currentUserId}</Typography>
      <Box display="flex" height="90vh" width="100vw">
        <Paper
          elevation={3}
          sx={{
            flexBasis: "25%",
            backgroundColor: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ddd",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              padding: "16px",
              textAlign: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            Connected Users
          </Typography>
          <List sx={{ overflowY: "auto", flexGrow: 1 }}>
            {connectedUsers.map((user) => (
              <ListItem
                button
                key={user}
                selected={activeUser === user}
                onClick={() => handleUserClick(user)}
                sx={{
                  "&.Mui-selected": { backgroundColor: "#e9ecef" },
                  "&:hover": { backgroundColor: "#e9ecef" },
                }}
              >
                <ListItemText primary={user} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box flexGrow={1} display="flex" flexDirection="column">
          {activeUser ? (
            <>
              {}
              <Box
                sx={{
                  padding: "16px",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">Chat with: {activeUser}</Typography>
                <Box>
                  <IconButton
                    aria-label="Start Video Call"
                    color="primary"
                    onClick={() => handleCall("video")}
                  >
                    <VideoCallIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Start Audio Call"
                    color="primary"
                    onClick={() => handleCall("audio")}
                  >
                    <CallIcon />
                  </IconButton>
                </Box>
              </Box>
              {}
              <Box
                flexGrow={1}
                p={2}
                sx={{ overflowY: "auto", backgroundColor: "#fff" }}
                display="flex"
                flexDirection="column"
              >
                {messages[activeUser]?.map((msg, index) => (
                  <Typography
                    key={index}
                    sx={{
                      padding: "8px",
                      margin: "4px 0",
                      backgroundColor:
                        msg.type === "sent" ? "#d1e7dd" : "#e9ecef",
                      borderRadius: "8px",
                      maxWidth: "70%",
                      alignSelf:
                        msg.type === "sent" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.text}
                  </Typography>
                ))}
              </Box>
              {}
              <Box
                display="flex"
                p={2}
                sx={{
                  borderTop: "1px solid #ddd",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  sx={{
                    flexGrow: 1,
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendMessage}
                  sx={{ marginLeft: "8px" }}
                >
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{ margin: "auto", textAlign: "center", color: "#aaa" }}
            >
              Select a user to start chatting
            </Typography>
          )}
        </Box>
        {incomingCall && (
          <Dialog open={true} onClose={handleRejectCall}>
            <DialogTitle>Incoming {incomingCall.callType} Call</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {incomingCall.from} is calling you.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleAcceptCall} color="primary">
                Accept
              </Button>
              <Button onClick={handleRejectCall} color="secondary">
                Reject
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};
export default Body;
