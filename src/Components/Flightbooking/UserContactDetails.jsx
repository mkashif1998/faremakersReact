import { React, useState, Fragment, useRef, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AllCountrySelection from './Comman/AllCountrySelection';
import { InputAdornment } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Popover from '@mui/material/Popover';
import * as images from '../../Constant/images';
import { useNavigate } from 'react-router-dom';
import { requestPNRCreate, requestTravelerInfo } from '../../API/index';
import Loader from '../../Loader/Loader';
import AutoTabDate from './Comman/AutoTabDate';
import { handleShowErrorAlert } from '../../helpers/sweatalert';

const UserContactDetails = (props) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [Otp, setOtp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isColorChange, setIsColorChange] = useState("");
  const [isOtpTrue, setIsOtpTrue] = useState('');
  const [showMessage, setShowMessage] = useState('');
  const [displayContact, setDisplayContact] = useState(false);
  const [storeEmail, setStoreEmail] = useState('');
  const [OTPResend, setOTPResend] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [lNameDialog, setlNameDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [formData, setFormData] = useState([]);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const [isSmallScreen, setSmallScreen] = useState(window.innerWidth < 462)

  // ----------------------?\

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      const updatedData = [...prevFormData];  // Create a copy of the previous state array
      updatedData[index] = {
        ...updatedData[index],
        [name]: value
      };
      return updatedData;
    });
  }

  // console.log(formData);
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const { stateA, stateB } = props;
  const flightDetails = JSON.parse(localStorage.getItem("bookingTicket"));
  const { adults, children, infants } = flightDetails;

  const passengerDetails = adults + children + infants;
  const navigate = useNavigate();
  const otpInputs = useRef([]);

  const handleOtp = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 1);
    const newOtpValues = [...Otp];
    newOtpValues[index] = sanitizedValue;
    setOtp(newOtpValues);

    if (index < otpInputs.current.length - 1 && sanitizedValue) {
      otpInputs.current[index + 1].focus();
    } else if (index === otpInputs.current.length - 1 && sanitizedValue) {
      const enteredOtp = newOtpValues.join('');
      if (enteredOtp === '1111') {
        setIsOtpTrue(true);
        setDisplayContact(true);
      } else {
        setIsOtpTrue(false);
      }
    }
  };
  const handleInputClick = (index) => {
    setIsColorChange(index);
  };
  const handleInputFocus = (index) => {
    setIsColorChange(index);
  };
  const HandleGetOTP = () => {
    setCurrentTime(10);
    setIsTimerRunning(true);
  };
  const handleEmail = (event) => {
    setStoreEmail(event);
  }
  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setCurrentTime((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (currentTime === 0) {
      setIsTimerRunning(false);
    }
  }, [currentTime]);
  useEffect(() => {
    if (isOtpTrue === true || isOtpTrue === false) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setIsOtpTrue(null);
      }, 1000);
      setOtp([]);
      otpInputs.current[0].focus();
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isOtpTrue]);

  useEffect(() => {
    const handleSideBar = () => {
      // setIsMobile(window.innerWidth < 769);
      setSmallScreen(window.innerWidth < 462);
    };
    window.addEventListener('resize', handleSideBar);
    return () => {
      window.removeEventListener("resize", handleSideBar);
    }
  }, []);
  const sendOTPHandller = () => {
    setOTPResend(true);
  }
  // const handleChange = (event) => {
  //   setGender(event.target.value);
  // };
  const handleOpenDialog = (event) => {
    setDialogOpen(!isDialogOpen);
    setAnchorEl(event.currentTarget);
  }
  const handlelNameDialog = (event) => {
    setAnchorEl(event.currentTarget);
    setlNameDialog(!lNameDialog);
  }
  const HandleCloseDialog = () => {
    setDialogOpen(false);
    setlNameDialog(false);
  }
  const travelFormValid = () => {
    for (let i = 0; i < passengerDetails; i++) {
      const formDataItem = formData[i];

      const fname = formDataItem && formDataItem[`fname${i}`];
      const lname = formDataItem && formDataItem[`lname${i}`];
      const gender = formDataItem && formDataItem[`gender${i}`];
      const countery = formDataItem && formDataItem[`countery${i}`];
      const passport = formDataItem && formDataItem[`passport${i}`];
      const dob = formDataItem && formDataItem[`DateOfBirth${i}`];
      const expiredate = formDataItem && formDataItem[`PassportExpiryDate${i}`];

      if (!fname || !lname || !gender || !countery || !passport || expiredate === "DD-MM-YYYY" || dob === "DD-MM-YYYY") {
        return true;
      }
    }

    return true;
  };

  const modifiedFormData = formData.map(item => {
    const modifiedItem = {};
    for (const key in item) {
      const newKey = key.replace(/\d/g, ''); // Remove digits from the key
      modifiedItem[newKey] = item[key];
    }
    return modifiedItem;
  });

  const handleNavigation = async () => {
    
    try {
      setLoading(true);
      let getPNRNumber = ''
      const PNRRespon = await requestPNRCreate(formData);
      // console.log(userInfodetails);
      if (PNRRespon?.Success === false) {
        const message = PNRRespon.Response.message
        handleShowErrorAlert(message);
      }
      else if(PNRRespon?.status === "NotProcessed") {
        handleShowErrorAlert("Incomplete");
      }
      else if (PNRRespon?.CreatePassengerNameRecordRS?.ApplicationResults?.status === "Incomplete") {
        const message = PNRRespon.CreatePassengerNameRecordRS.ApplicationResults.Warning[0].SystemSpecificResults[0].Message[0].content
        handleShowErrorAlert(message);
      }
      else {
        if (PNRRespon?.Success === true) {
          getPNRNumber = PNRRespon.Response.Data
        }
        else {
          getPNRNumber = PNRRespon.CreatePassengerNameRecordRS.ItineraryRef.ID;
        }
        const userInfodetails = [
          { phoneNumber: phoneNumber ,PNR: getPNRNumber,userEmail: storeEmail, ...modifiedFormData}
        ];
        const travellerInfo = await requestTravelerInfo(userInfodetails); // save user data in database
        console.log(travellerInfo);
        localStorage.setItem("PNRNumber",JSON.stringify(getPNRNumber));
        alert(getPNRNumber)
        navigate('/bookingpayment');
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {stateA ? ('') : (
            <Fragment>
              <div className="contact_details_main">
                <div className="d-flex justify-content_start">
                  <div className="iti_numbering d-flex align-self-center">
                    <p>2</p>
                  </div>
                  <div className="">
                    <h5 className="iti_heading_size">Add Traveller Details</h5>
                    <p className="iti_sub_heading">
                      E-Ticket details will be emailed and sent via SMS
                    </p>
                  </div>
                </div>
                <div className="user_contact_info">
                  <p className="iti_mob_title">Phone Number<span className='text-danger'>*</span></p>
                </div>
                <div className="d-flex justify-content-start wrap  flex-wrap">
                  <div className="ph_input_filed">
                    <PhoneInput
                      country={'pk'}
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <button type="button" onClick={sendOTPHandller} className="btn btn-primary iti_otp_button">
                      Get OTP
                    </button>
                  </div>
                </div>
                <div className="user_contact_info">
                  <p className="iti_mob_title">OTP (Authentication Code) 1111</p>
                </div>
                <div className="iti_otp_main d-flex justify-content-start">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className={`otp_block ${isColorChange === index ? 'blue_border_input' : ''
                        }`}
                      maxLength={1}
                      value={Otp[index] || ''}
                      onChange={(e) => handleOtp(index, e.target.value)}
                      ref={(input) => (otpInputs.current[index] = input)}
                      onClick={() => handleInputClick(index)}
                      onFocus={() => handleInputFocus(index)}
                    />
                  ))}
                </div>
                <div className='otp_message_placeholder'>
                  {showMessage && (
                    <p className="otp_message"> {isOtpTrue ? (<span className="success_message">OTP successfull</span>) : (<span className='failer_message'>Please Enter a Valid OTP</span>)}</p>
                  )
                  }
                </div>
                {OTPResend ? (
                  <div className="otp_resend_time">
                    Have Not Received OTP ?{' '}
                    {isTimerRunning ? (
                      <span> Resend in {currentTime} sec</span>
                    ) : (
                      <span onClick={HandleGetOTP} className="otp_resend_button">
                        Resend
                      </span>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
                <div className="user_contact_info">
                  <p className="iti_mob_title">Email (Optional)</p>
                  <div className="iti_email_field">
                    <input
                      type="email"
                      onChange={(e) => handleEmail(e.target.value)}
                      placeholder='Enter your Email Address' className='mail_input_field' />
                  </div>
                </div>
              </div>
              <div>
                {displayContact && (
                  <div className="traveler_detail_main">
                    <div className="trav_data_main">
                      <h5 className="trav_heading"> Traveller Details</h5>
                      <div className="td_adults_details">

                        {Array.from({ length: passengerDetails }).map((_, index) => (
                          <div key={index} className="each_passanger_record">
                            <div className="adults_flight_info">
                              <h3 className="underline_text">
                                {index < adults ? `Adult` : index < adults + children ? `Child` : `Infant`}
                              </h3>
                            </div>
                            <div className="adults_input_fields  ">
                              <div className='important_note'>
                                <span className='adult_pre_icon align-self-center '><TipsAndUpdatesIcon /></span>
                                {isSmallScreen ? (<span className="adult_precautions  align-self-center">  Important : <br /></span>) : (<span className="adult_precautions  align-self-center">  Important :</span>)}
                                <span className={`precaution_data ${isSmallScreen ? 'mob_announce_heading' : ''}`}> Enter your name as it mentioned on your passport </span>
                              </div>
                              <div className='row p-0 m-0'>
                                <div className='col-md-4 mb-3'>
                                  <TextField
                                    id="outlined-fname-input"
                                    label="First Name"
                                    type="alphbatic"
                                    className='fname_textfield'
                                    size="small"
                                    name={`fname${index}`}
                                    onChange={(e) => handleInputChange(e, index)}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment>
                                          <ErrorOutlineIcon className="fname_detailed_icon" onClick={handleOpenDialog} />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                  <Popover
                                    open={isDialogOpen}
                                    onClose={HandleCloseDialog}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                      vertical: 'top',
                                      horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'center',
                                    }}
                                  >
                                    <iconButton onClick={HandleCloseDialog} className="dialog_header d-flex justify-content-between" >
                                      <span className="dialog_fname_headind align-self-center"> Your Given Name</span> <div className="Dialog_close_icon align-self-center"><CloseIcon /></div>
                                    </iconButton>
                                    <DialogContent>
                                      <img src={images.passport_Fname} alt="" width="350px" />
                                    </DialogContent>
                                  </Popover>
                                </div>
                                <div className='col-md-4 mb-3'>
                                  <TextField
                                    id="outlined-fname-input"
                                    label="Last Name"
                                    name={`lname${index}`}
                                    type="text"
                                    className='fname_textfield'
                                    size="small"
                                    onChange={(e) => handleInputChange(e, index)}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment>
                                          <ErrorOutlineIcon className="fname_detailed_icon" onClick={handlelNameDialog} />
                                        </InputAdornment>
                                      )
                                    }}
                                  />
                                  <Popover
                                    open={lNameDialog}
                                    onClose={HandleCloseDialog}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                      vertical: 'top',
                                      horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'center',
                                    }}
                                  >
                                    <iconButton onClick={HandleCloseDialog} className="dialog_header d-flex justify-content-between" >
                                      <span className="dialog_fname_headind align-self-center"> Your SurName</span> <div className="Dialog_close_icon align-self-center"><CloseIcon /></div>
                                    </iconButton>
                                    <DialogContent >
                                      <img src={images.passport_Lname} alt="" width="350px" />
                                    </DialogContent>
                                  </Popover>
                                </div>
                                <div className='col-md-4 mb-3'>
                                  <FormControl className="fname_textfield" size="small">
                                    <InputLabel id="demo-simple-select-helper-label">Gender</InputLabel>
                                    <Select
                                      labelId="demo-simple-select-helper-label"
                                      id="demo-simple-select-helper"
                                      value={
                                        formData[index] && formData[index][`gender${index}`]
                                          ? formData[index][`gender${index}`]
                                          : ''
                                      }
                                      label="Gender"
                                      name={`gender${index}`}
                                      onChange={(e) => handleInputChange(e, index)}
                                    >
                                      <MenuItem value={'Male'}>Male</MenuItem>
                                      <MenuItem value={'Female'}>Female</MenuItem>
                                    </Select>
                                  </FormControl>
                                </div>
                                <div className='col-md-4 mb-3'>
                                  <div className="fname_textfield" >
                                    <p className="dob_heading">Nationality</p>
                                    <AllCountrySelection name={`countery${index}`}
                                      onChange={(e) => handleInputChange(e, index)} />
                                  </div>
                                </div>
                                {index < adults ?
                                  <div className='col-md-4 mb-3'>
                                    <div className="passanger_gender_input">
                                      <p className="dob_heading">CNIC No:</p>
                                      <TextField name={`cnic${index}`}
                                        onChange={(e) => handleInputChange(e, index)} id="outlined-basic" placeholder="CNIC No" variant="outlined" size="small" />
                                    </div>
                                  </div>
                                  :
                                  null
                                }
                                <div className='col-md-4 mb-3'>
                                  <div className="fname_textfield">
                                    <p className="dob_heading">Passport No:</p>
                                    <TextField name={`passport${index}`}
                                      onChange={(e) => handleInputChange(e, index)} id="outlined-basic" placeholder="Passport No" variant="outlined" size="small" />
                                  </div>
                                </div>
                                {index < adults + children ?
                                  <div className='col-md-4 mb-3'>
                                    <p className="dob_heading">Wheel Chair:</p>
                                    <FormControl className="fname_textfield" size="small">
                                      <Select
                                        // labelId="demo-simple-select-helper-label"
                                        id="demo-simple-select-helper"
                                        value={
                                          formData[index] && formData[index][`wheelChair${index}`]
                                            ? formData[index][`wheelChair${index}`]
                                            : 'N'
                                        }
                                        label="WheelChair"
                                        name={`wheelChair${index}`}
                                        onChange={(e) => handleInputChange(e, index)}
                                      >
                                        <MenuItem value={'Y'}>Yes</MenuItem>
                                        <MenuItem selected value={'N'}>No</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  :
                                  null
                                }
                                <div className="col-md-6 col-lg-4 mb-3"><AutoTabDate traveller={index < adults ? `Adult` : index < adults + children ? `Child` : `Infant`} label="Date Of Birth" value={index} handleInputChange={handleInputChange} /></div>
                                <div className="col-md-6 col-lg-4 mb-3"><AutoTabDate traveller={index < adults ? `Adult` : index < adults + children ? `Child` : `Infant`} label="Passport Expiry Date" value={index} handleInputChange={handleInputChange} /></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="move_payment_button">
                      <button type="button" className={`btn btn-primary continue_button  ${travelFormValid() ? 'c-pointer' : 'c-not-allowed-btn'}`} disabled={!travelFormValid()} onClick={handleNavigation}>Continue to Payment</button>
                    </div>
                  </div>
                )
                }
              </div>
            </Fragment>
          )}

          {stateB ?
            (
              <div className="contact_details_main">
                <div className="d-flex justify-content_start">
                  <div className="iti_numbering iti_disabled_col disabled_border d-flex align-self-center">
                    <p>2</p>
                  </div>
                  <div className="d-flex align-self-center iti_disabled_col">
                    <h5 className="iti_heading_size">Add Traveller Details</h5>
                  </div>
                </div>
                {/* )
           } */}
              </div>
            ) : ('')}

        </Fragment>
      )}
    </Fragment>
  );

};

export default UserContactDetails;
