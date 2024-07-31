import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Doodle from "./pics/loginDoodles.png";

import "./inputStyle.css";

function Input() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username !== "" && password !== "") {
      try {
        const response = await axios.post("http://localhost:8000/sessions", {
          username,
          password,
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        console.log("Login successful", response.data);
        navigate("/quotes");
      } catch (err) {
        setWrong(true);
      }
    } else {
      setWrong(true);
    }
  };

  return (
    <div className="center">
      <img src={Doodle} alt="logo" className="loginPic"></img>
      <div className="center2">
        <div className="container">
          <div>
            <input
              className={wrong ? "user2" : "user"}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              className={wrong ? "pass2" : "pass"}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="btnHolder">
            <Button
              variant="outlined"
              sx={{
                width: "300px",
                height: "45px",
                fontFamily: "Dosis",
                fontSize: "30px",
                overflow: "hidden",
                marginTop: "30px",
                borderWidth: "1px",
                borderRadius: "5px",
                color: "gray",
                borderColor: "gray",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  borderColor: "black",
                  borderWidth: "1.2px",
                },
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Input;
