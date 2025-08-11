import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

import { register } from "../../actions/authActions";
import { clearMessage, setMessage } from "../../redux/message";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import logo from '../../assets/images/logo/logo.png';

const RegisterSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  captcha: yup.string().required("Captcha is required"),
});

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validateCaptcha, setValidateCaptcha] = useState([]);
  const [loading, setLoading] = useState(false);
  const { message } = useSelector((state) => state.message);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const errLogin = useSelector((state) => state.auth.error);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [username, setUsername] = useState(""); // Add this line
  const canvasRef = useRef(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({ mode: "onChange"});



  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    initializeCaptcha(ctx);
  }, []);

  const generateRandomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

  const generateCaptchaText = () => {
    const chrs = "0123456789";
    const n = 4;
    let captcha = "";
    for (let i = 0; i < n; i++) {
      captcha += chrs[Math.floor(Math.random() * chrs.length)];
    }
    return captcha;
  };

  const drawCaptchaOnCanvas = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const textColors = ["rgb(0,0,0)", "rgb(130,130,130)"];
    const letterSpace = 150 / captcha.length;
    for (let i = 0; i < captcha.length; i++) {
      const xInitialSpace = 25;
      ctx.font = "20px Roboto Mono";
      ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
      ctx.fillText(
        captcha[i],
        xInitialSpace + i * letterSpace,
        Math.floor(Math.random() * 16 + 25),
        100
      );
    }
  };

  const initializeCaptcha = (ctx) => {
    setUserInput("");
    const newCaptcha = generateCaptchaText();
    setCaptchaText(newCaptcha);
    drawCaptchaOnCanvas(ctx, newCaptcha);
  };

  const handleUserInputChange = async (e) => {
    setUserInput(e.target.value);
    await trigger("captcha");
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleRegister = async () => {
    if (userInput === captchaText) {
      try {
        setLoading(true);
        const registerResult = await dispatch(register(username, email, password));
        // Handle registration success
      } catch (error) {
        // Handle registration error
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(setMessage("Captcha Salah"));
      // Reinitialize captcha
    }
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
          maxWidth="400px"
          padding="2rem"
          boxShadow={3}
          borderRadius="12px"
          bgcolor="background.paper"
        >
 <img
            src={logo}
            alt="Lab Logo"
            width="150"
            className="d-inline-block align-top"
          />
          <br/>
          <Typography variant="body1" gutterBottom>
           Register
          </Typography>
          {message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(handleRegister)} sx={{ width: '100%' }}>
          <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  value={email} // Ensure email state is used
                  onChange={(e) => {
                    field.onChange(e);
                    setEmail(e.target.value); // Update to set email state
                  }}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username ? errors.username.message : ""}
                  value={username} // Update to use username state
                  onChange={(e) => {
                    field.onChange(e);
                    setUsername(e.target.value); // Update to set username state
                  }}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  value={password} // Ensure password state is used
                  onChange={(e) => {
                    field.onChange(e);
                    setPassword(e.target.value); // Update to set password state
                  }}
                />
              )}
            />
            
            <Box display="flex" alignItems="center" mb={2}>
              <canvas ref={canvasRef} width="250vw" height="45"></canvas>
              <IconButton
                onClick={() => initializeCaptcha(canvasRef.current.getContext("2d"))}
              >
                <RotateLeftIcon />
              </IconButton>
            </Box>
            <Controller
              name="captcha"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Enter Captcha Here"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.captcha}
                  helperText={errors.captcha ? errors.captcha.message : ""}
                  value={userInput}
                  onChange={(e) => {
                    field.onChange(e);
                    setUserInput(e.target.value);
                  }}
                />
              )}
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Daftar"}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <span>Already have an account?</span>
            <Link to="/"> Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
