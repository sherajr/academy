import { ConnectWallet, Web3Button, useContract, useContractRead, useContractWrite, useContractEvents, useAddress, useStorage, MediaRenderer } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { useState, useEffect } from 'react';
import Web3 from 'web3';

import { ethers } from "ethers";

//Factory Contract Functions
export default function Home() {
  const academyAddress = "0x03aB6c074373e7957e07bF3FEb0629E5323a464B"
  // eslint-disable-next-line
  const { contract, isLoadingContract, errorContract } = useContract(academyAddress); //Make sure to change initilize call (academyAddress) as well if you change this.
  const address = useAddress();
  const [account, setAccount] = useState("");
  console.log("account:", account);
  // const { account } = address || {};
  const { data: event } = useContractEvents(
    contract,
    "CourseCreated",
    {
      queryFilter: {
        filters: {},
        fromBlock: 	44871649, // Events starting from this block
        toBlock: "latest", // Events up to this block
        order: "asc", // Order of events ("asc" or "desc")
      },
      subscribe: true, // Subscribe to new events
    },
  );
// eslint-disable-next-line
  const { data: academyInfo, Loading: isLoadingAcademyInfo, error: academyInfoError } = useContractRead(contract, "academyInfo");
  console.log("academyInfo:", academyInfo);
  // const [courseCount, setCourseCount] = useState(0);

    useEffect(() => {
      if (address & event) {
        setAccount(address);
        // setCourseCount(data.length);
      }
    }, [address, event]);

    console.log("address:", address);

  

    // useEffect(() => {
    //   if (data) {
    //     setCourseCount(data.length);
    //   }
    // }, [data]);

    //TROUBLESHOOTING
    //console.log("item:", item);
    console.log("data:", event);
    
  
    // Use the useContractWrite hook to create a function for creating courses
    // eslint-disable-next-line
  const { mutateAsync: createCourse, isLoading: isCreatingCourse } = useContractWrite(contract, "createCourse");

  const createCourseCall = async () => {
    try {
      // Temporarily set args to an empty array
      const data = await createCourse({ args: [] });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  console.log("academyInfo:", academyInfo);
  
//Page layout

  return (
    <div className="container">
      <main className="main">       
        <h1 className="title">
          Welcome to <a href="https://www.peaceantz.com/">Peace Antz Academy</a>!
        </h1>
        <div className="connect">
          <ConnectWallet
           dropdownPosition={{ side: 'bottom', align: 'center'}} 
           onConnect={(address) => (address)}
           />
        </div>

        <div className="description">
        “Live as if you were to die tomorrow. Learn as if you were to live forever.” - Mahatma Gandhi 
         <div>
            {isLoadingAcademyInfo ? (
              <p>Loading...</p>
            ) : (
              <div className = "course-card">
                <p className= "card h2">TVL: {ethers.utils.formatEther(academyInfo?.tvl || '0')} MATIC </p>
                <p className= "card h2">Total Sponsored: {ethers.utils.formatEther(academyInfo?.totalSponsored || '0')} MATIC </p>
                <p className= "card h2">Total Staked: {ethers.utils.formatEther(academyInfo?.totalStaked || '0')} MATIC </p>
                <p className= "card h2">Total Payout: {ethers.utils.formatEther(academyInfo?.totalPayout || '0')} MATIC </p>
                <p className= "card h2">Fail Fund: {ethers.utils.formatEther(academyInfo?.failFund || '0')} MATIC </p>
              </div>
            )}
          </div>
         <div>{isLoadingContract ? (<p>Loading...</p> ):( contract && <p className="medium-text">Factory Contract Address: {academyAddress}</p>)}</div>
         {/* <div className="grid">
          <a href="https://www.peaceantzacademy.com/home" className="card">
            <h2>Teachers &rarr;</h2>
            <p>
            Create courses, get sponsored, and enable people to learn from a course design of your choosing. 
            </p>
          </a>

          <a href="https://www.peaceantzacademy.com/home" className="card">
            <h2>Students &rarr;</h2>
            <p>
            Keep yourself accountable by staking to enroll and lockup funds until course is passed.  
            </p>
          </a>

          <a href="https://www.peaceantzacademy.com/home" className="card">
            <h2>Sponsor &rarr;</h2>
            <p>
            Scout for talent and contribute to the growth and development of the community!
            </p>
          </a>
        </div> */}
         
         Earn from teaching your own course!
         Learn by staking to take courses! Recruit talent by sponsoring a Course! 
         <p>
         Have your syllabus ready? Create your Course now!
          </p>
        </div>
        
        <div>
        {/* Add a button for creating courses */}
        <Web3Button
          contractAddress= {academyAddress}
          action={createCourseCall}
          theme="dark"
        >
          Create Course
        </Web3Button><p></p>
      </div>

      <div>
      {event && event.length > 0 && [...event].sort((a, b) => b.transaction.blockNumber - a.transaction.blockNumber).map((item, index) => (
  <CourseCard key={index} item={item} academyAddress={academyAddress} courseNumber={event.length - index} />
))}
      </div>

      </main>
    </div>
  );
}

//Course Contract functions
function CourseCard({ item, courseNumber, academyAddress }) {

  //This uses the contract of each separate course
  const { contract } = useContract(item.data.courseId);

  const address = useAddress();

  const storage = new useStorage({
    gatewayUrls: ["https://peace-antz-academy.infura-ipfs.io","https://ipfs.thirdwebcdn.com/ipfs/"],
  });


  // const [_address, setAddress] = useState("");
  // useEffect(() => {
  //   if (address) {
  //     setAddress(address);
  //   }
  // }, [address]);

  //Roles
  const role = {
    "ADMIN": "0xa0f2aec2c0a3b5c1c964e3277c8ca4f6a9a7f6474a1b9c3f912258c8e46e7a28",
    "TEACHER": "0x5d2b5dbf9587f8e7d3e3f5b98b75a8e7ddd5a41a94b4742bc1b17040e7e62468",
    "STUDENT": "0x8b93a5a0cb4c6e3780e3b19b3b1651c2c2a8237b1ea5693b5f839a153f3a3e6c",
    "SPONSOR": "0x5f0a5f78118b6e0b700e0357ae3909aaafe8fa706a075935688657cf4135f9a9",
  };
  
  //Write hooks
  const { mutateAsync: initializeCourse, isLoading: isInitializingCourse } = useContractWrite(contract, "initialize");
  const { mutateAsync: setPayment, isLoading: isSettingPayment } = useContractWrite(contract, "setAmount");
  const { mutateAsync: enroll, isLoading: isLoadingEnroll } = useContractWrite(contract, "enroll");
  const { mutateAsync: withdraw, isLoading: isLoadingWithdraw } = useContractWrite(contract, "withdraw");
  const { mutateAsync: sponsor, isLoading: isLoadingSponsor } = useContractWrite(contract, "sponsor", { gasPrice: 5000000000 });
  const { mutateAsync: unsponsor, isLoading: isLoadingUnsponsor } = useContractWrite(contract, "unsponsor");
  const { mutateAsync: startCourse, isLoading: isLoadingStartCourse } = useContractWrite(contract, "updateCourseStatus");
  const { mutateAsync: bootStudent, isLoading: isLoadingBoot } = useContractWrite(contract, "bootStudent");
  const { mutateAsync: claimPayment, isLoading: isLoadingClaim } = useContractWrite(contract, "claimPayment");
  const { mutateAsync: dropOut, isLoading: isLoadingDropout } = useContractWrite(contract, "dropOut");
  const { mutateAsync: grantRole, isLoading: isLoadingGrantRoll } = useContractWrite(contract, "grantRole");
  const { mutateAsync: revokeRole, isLoading: isLoadingRevokeRoll } = useContractWrite(contract, "revokeRole");
  const { mutateAsync: passStudent, isLoading: isLoadingPass } = useContractWrite(contract, "passStudent");
  
  //Read hooks
  const { data: factoryAddress } = useContractRead(contract, "factoryAddress");
  const { data: teacherAddress } = useContractRead(contract, "teacher");
  const { data: uri } = useContractRead(contract, "uri");

  //const { data: courseCompleted, isLoading: isLoadingCourseCompleted } = useContractRead(contract, "courseCompleted", { args: [studentCheckAddress] });
  const { data: courseStatus, isLoading: isLoadingCourseStatus } = useContractRead(contract, "courseStatus");
  //const { data: role, isLoading: isLoadingRole } = useContractRead(contract, "hasRole", [role, account]);
  const { data: payment, isLoading: isLoadingPayment } = useContractRead(contract, "payment");
  const { data: paymentStatus, isLoading: isLoadingPaymentStatus } = useContractRead(contract, "paymentStatus");
  const { data: paymentTimestamp, isLoading: isLoadingPaymentTimestamp } = useContractRead(contract, "paymentTimestamp");
  //const { data: sponsorDeposit, isLoading: isLoadingSponsorDeposit } = useContractRead(contract, "sponsorDeposit", { args: [sponsorCheckAddress] });
  //const { data: sponsorCheck, isLoading: isLoadingSponsorCheck } = useContractRead(contract, "sponsors", { args: [sponsorCheckAddress] });
  const { data: sponsorshipTotal, isLoading: isLoadingSponsorshipTotal, error: sponsorshipTotalError } = useContractRead(contract, "sponsorshipTotal");
  const { data: studentDeposit, isLoading: isLoadingStudentDeposit, error: studentDepositError } = useContractRead(contract, "studentDeposit", [address]);
  const { data: studentStake, isLoading: isLoadingStudentStake, error: studentStakeError } = useContractRead(contract, "studentStake");
  //const { data: studentCheck, isLoading: isLoadingStudentCheck } = useContractRead(contract, "students", { args: [studentCheckAddress] });
  // Can instantiate the downloader with the default gateway URLs

  if (sponsorshipTotalError) {
    console.log("failed to read contract", sponsorshipTotalError);
  }

  
  
  //Event hooks
  const { data: paymentStatusEvents } = useContractEvents(
    contract,
    "PaymentStatus",
    {
      queryFilter: {
        filters: {},
        fromBlock: 44871649, // Events starting from this block
        toBlock: "latest", // Events up to this block
        order: "asc", // Order of events ("asc" or "desc")
      },
      subscribe: true, // Subscribe to new events
    },
  );
  const { data: roleGrantedEvents } = useContractEvents(
    contract,
    "RoleGranted",
    {
      queryFilter: {
        filters: {},
        fromBlock: 44871649, // Events starting from this block
        toBlock: "latest", // Events up to this block
        order: "asc", // Order of events ("asc" or "desc")
      },
      subscribe: true, // Subscribe to new events
    },
  );
  const { data: dropoutEvents } = useContractEvents(
    contract,
    "DropOut",
    {
      queryFilter: {
        filters: {},
        fromBlock: 44871649, // Events starting from this block
        toBlock: "latest", // Events up to this block
        order: "asc", // Order of events ("asc" or "desc")
      },
      subscribe: true, // Subscribe to new events
    },
  );
  
  
  //State hooks

  const [roleGranted, setRoleGranted] = useState(false);
  const [paymentSet, setPaymentSet] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const paymentAmountInWei = ethers.utils.parseUnits(paymentAmount.toString(), 'ether');

  const [sponsorAmount, setSponsorAmount] = useState(0);
  let sponsorAmountInWei = '0';
    if (sponsorAmount !== '') {
        sponsorAmountInWei = ethers.utils.parseUnits(sponsorAmount.toString(), 'ether');
    }

  
  const [bootAddress, setBootAddress] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [unsponsorAddress, setUnsponsorAddress] = useState("");
  // const [unsponsorAmount, setUnsponsorAmount] = useState(0);
  // const unsponsorAmountInWei = ethers.utils.parseUnits(unsponsorAmount.toString(), 'ether');

  const [initData, setInitData] = useState([]);
  const [account, setAccount] = useState("");
  const [courseCount, setCourseCount] = useState(0);
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState(null);
  const [uriData, setUriData] = useState("");
  const [uriSyl, setUriSyl] = useState("");
  const [json, setJson] = useState("");
  //const [courseId, setCourseId] = useState([]);

    // Additional state Course Info
    const [courseTitle, setCourseTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timeCommitment, setTimeCommitment] = useState("");
    const [courseInfo, setCourseInfo] = useState(null);
    const [isLoadingCourseInfo, setIsLoadingCourseInfo] = useState(true);
    const [pdfData, setPdfData] = useState("");
    const [syllabusPdf, setSyllabusPdf] = useState(null);
    const [startDateTime, setStartDateTime] = useState("");
    const [courseLStatus, setCourseLStatus] = useState('Pending');




  let enrollStake;
  if (studentStake) {
    enrollStake = ethers.utils.formatEther(studentStake.toString());
  }

  // const studentStakeWei = ethers.BigNumber.from(studentStake);
  // const studentStakeEther = ethers.utils.formatEther(studentStakeWei);
  
  console.log("enrollStake", enrollStake);
  console.log("sponsorAmountInWei", sponsorAmountInWei);
  console.log("sponsorAmount", sponsorAmount);
  // console.log("sponsorAmountInWei", unsponsorAmountInWei);
  // console.log("sponsorAmount", unsponsorAmount);
  // console.log("studentStakeWei", studentStakeWei);
  // console.log("studentStakeEther", studentStakeEther);

  useEffect(() => {
    if (!paymentStatus && !courseStatus) {
      setCourseLStatus("Pending");
    } else if (paymentStatus && !courseStatus) {
      setCourseLStatus("Open");
    } else if (!paymentStatus && courseStatus) {
      setCourseLStatus("In-Progress");
    } else if (paymentStatus && courseStatus) {
      setCourseLStatus("Complete");
    }
  }, [paymentStatus, courseStatus]);


  useEffect(() => {
    if (address && roleGrantedEvents && roleGrantedEvents.length > 0) {
      setRoleGranted(true);
      setAccount(address);
    }
  }, [roleGrantedEvents, address]);

  useEffect(() => {
    if (paymentStatusEvents && paymentStatusEvents.some(event => event.data.paymentStatus === true)) {
      setPaymentSet(true);
    } else {
      setPaymentSet(false);
    }
  }, [paymentStatusEvents, roleGrantedEvents]);

  useEffect(()=>{
    if (studentAddress){
      setStudentAddress(studentAddress);
    }

  }, [studentAddress]);

  useEffect(() => {
    async function fetchBalance() {
      // Initialize web3 (make sure you have a provider, e.g. MetaMask)
      const web3 = new Web3(Web3.givenProvider || "https://polygon-rpc.com");

      // Fetch the balance
      const contractBalance = await web3.eth.getBalance(item.data.courseId);

      console.log("Raw Balance in Wei:", contractBalance); // Log the raw balance

      // Convert the balance to Ether and set it to the state
      setBalance(web3.utils.fromWei(contractBalance, 'ether'));
    }

    fetchBalance();
  }, [roleGrantedEvents]);

  useEffect(() => {
    if (syllabusPdf) {
      setSyllabusPdf(syllabusPdf);
    }
  }, [syllabusPdf]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (courseInfo) {
  //         setCourseInfo(courseInfo);
  //         const uriData = await uriCall();
  //         setUriData(uriData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching course data:', error);
  //     }
  //   };

  // }, [courseInfo, uriData]);

  useEffect(() => {
    if (pdfData) {
      setPdfData(pdfData);
    }
  });

  useEffect(() => {
    if (uriData && uriData.ok && uriData.headers && uriData.headers.get('content-type') === 'application/json') {
      uriData.json().then((data) => {
        setCourseInfo(data.courseInfo);
        
      }).catch((error) => {
        console.error('Failed to parse JSON data:', error);
      });
    }
  }, [uriData, paymentStatusEvents]);

  useEffect(() => {
    if (!courseInfo && uri) {
      uriCall();

    }
}, [isLoadingStudentDeposit, paymentStatusEvents, uri]);


    //TROUBLESHOOTING
console.log("item:", item);
console.log("factoryAddress:", factoryAddress);
console.log("teacherAddress:", teacherAddress);
console.log("courseStatus:", courseStatus);
console.log("payment:", payment);
console.log("paymentStatus:", paymentStatus);
console.log("paymentTimestamp:", paymentTimestamp);
console.log("sponsorshipTotal:", sponsorshipTotal);
console.log("studentDeposit:", studentDeposit);
console.log("studentStake:", studentStake);
console.log("paymentStatusEvents:", paymentStatusEvents);
console.log("roleGrantedEvents:", roleGrantedEvents);
console.log("dropoutEvents:", dropoutEvents);
console.log("courseInfo", courseInfo);
console.log("pdfData", pdfData);
console.log("syllabusPdf", syllabusPdf);


  //JS Functions
  // Function to retrieve course information from local storage

  
  const handlePdf = async (syllabusPdf) => {
    try {
      const pdfData = await storage.upload(syllabusPdf); // Assuming you have the `storage` object already defined
      console.log("PDF uploaded successfully:", pdfData);
      setPdfData(pdfData);
    } catch (error) {
      console.error("Failed to upload PDF:", error);
    }
  };

  const uploadFile = async () => {
    try {
      // Validate that all required information is present
      if (!courseTitle || !description || !timeCommitment || !pdfData) {
        console.error("Missing required course information");
        return null; // Exit the function early
      }
  
      const jsonFile = {
        courseInfo: {
          title: courseTitle,
          description: description,
          timeCommitment: timeCommitment,
          startDate: startDateTime,
          syllabus: pdfData
        }
      };
  
      const courseInfo = await storage.upload(jsonFile);
      console.log("File uploaded successfully:", courseInfo);
      return courseInfo;
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };
  
  
  

  const initializeCourseCall = async () => {
    try {
      const initData = await initializeCourse({ args: [item.data.account, academyAddress] });
      console.info("contract call success", initData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  console.log("initData:", initData);

  const setPaymentCall = async () => {
    try {
      // Upload the file and get the course info
      const courseInfo = await uploadFile();
  
      // Check if courseInfo is available
      if (!courseInfo) {
        console.error("Course info is not available");
        return;
      }
  
      const setPaymentData = await setPayment({ args: [paymentAmountInWei, courseInfo] });
      console.info("Contract call success", setPaymentData);
      const uriData = await uriCall();
      console.info("uriData call success", uriData);
    } catch (err) {
      console.error("Contract call failure", err);
    }
  };
  

  const enrollCall = async () => {
    try {
      const enrollData = await enroll({ 
        args: [], 
        overrides: { 
          value: studentStake
        } 
      }); 
      console.info("contract call success", enrollData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }


  const sponsorCall = async () => {
    try {
      const sponsorData = await sponsor({ 
        args: [], 
        overrides: { 
          value: sponsorAmountInWei
        } 
      }); 
      console.info("contract call success", sponsorData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const unsponsorCall = async () => {
    try {
      const unsponsorData = await unsponsor({ args: [address, sponsorAmountInWei] });
      console.info("contract call successs", unsponsorData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const startCourseCall = async () => {
    try {
      const startData = await startCourse({ args: [] }); 
      console.info("contract call success", startData);
      
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const bootCall = async () => {
    try {
      const bootData = await bootStudent({ args: [studentAddress] });
      console.info("contract call success", bootData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }
  

  const passCall = async () => {
    try {
      const passData = await passStudent({ args: [studentAddress] });
      console.info("contract call successs", passData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const claimCall = async () => {
    try {
      const claimData = await claimPayment({ args: [] });
      console.info("contract call successs", claimData);
      
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const dropCall = async () => {
    try {
      const dropData = await dropOut({ args: [] });
      console.info("contract call successs", dropData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  // const grantRoleCall = async () => {
  //   try {
  //     const grantRoleData = await grantRole({ args: [role, address] });
  //     console.info("contract call successs", grantRoleData);
  //   } catch (err) {
  //     console.error("contract call failure", err);
  //   }
  // }

  // const revokeCall = async () => {
  //   try {
  //     const revokeData = await revokeRole({ args: [role, address] });
  //     console.info("contract call successs", revokeData);
  //   } catch (err) {
  //     console.error("contract call failure", err);
  //   }
  // }

  const withdrawCall = async () => {
    try {
      const withdrawData = await withdraw({ args: [] });
      console.info("contract call successs", withdrawData);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const uriCall = async () => {
    try {
        if (uri !== null && uri !== undefined && uri !== "") {
            const uriData = await storage?.download(uri);
            setUriData(uriData);
            console.info("URI call success", uriData);
            return uriData;
        } else {
            console.error("URI is null or undefined.");
        }
    } catch (err) {
        console.error("URI call failure", err);
        throw err;
    }
};


  
  
  console.log("uri", uri);
  console.log("json", json);
  console.log("uriSyl", uriSyl);
  console.log("uriData", uriData);
//Course Card Design
//if (!address) return <div>No wallet connected</div>;

return (
  <div className={`card ${courseLStatus.toLowerCase()}`}> 
    <div className="card-info">
    <p className={`medium-text course-status ${courseLStatus.toLowerCase()}`}>
        Course Status: {courseLStatus}
      </p>
      <div className="contract-info">
        <p className="small-text">
          Course #: {courseNumber} | Block #: {item.transaction.blockNumber} | 
          Teacher Address: 
          <a href={`https://polygonscan.com/address/${item.data.account}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {item.data.account}
          </a> | 
          Contract Address: 
          <a href={`https://polygonscan.com/address/${item.data.courseId}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            {item.data.courseId}
          </a> | 
          Contract Balance: {balance} MATIC
        </p>
      </div>
      {teacherAddress == 0x0000000000000000000000000000000000000000 ? (
        <Web3Button
          contractAddress={item.data.courseId}
          action={initializeCourseCall}
          theme="dark"
          disabled={isInitializingCourse}
        >
          Initialize Course
        </Web3Button>
      ) : (
        <>
          {!paymentSet ? (
            <>
        <input
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Course Title"
          maxLength={50}
        />
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short Description"
          maxLength={150}
        />
        <input
          type="text"
          value={timeCommitment}
          onChange={(e) => setTimeCommitment(e.target.value)}
          placeholder="Time Commitment (hours)"
        />
        <label htmlFor="course-start">Course Start:</label>
        <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            placeholder="Start Date and Time"
        />
            <div className="upload-card">
                Upload Syllabus<p></p>
                <input
                id="file-upload"
                type="file"
                accept=".pdf"
                value={syllabusPdf}
                onChange={(e) => handlePdf(e.target.files[0])}
                //style={{display: 'none'}}
            />
            </div>

         <div>
         <input
            type="number"
            min="0"
            step="0.000000000000000001"
            value={paymentAmount}
            onChange={(e) => {
              const value = e.target.value;
              // Check if the value is not empty and is a number
              if (value.trim() !== '' && !isNaN(value) && Number(value) >= 0) {
                setPaymentAmount(value);
              } else {
                setPaymentAmount('0'); // Set an empty string or appropriate default value
              }
            }}
            placeholder="Enter amount in MATIC"
          />
      <Web3Button
        contractAddress={item.data.courseId}
        action={async () => {
          try {
            // First, upload the file
            const uploadResult = await uploadFile();
            console.log("File uploaded successfully:", uploadResult);

            // After successful file upload, call setPaymentCall
            const setPaymentResult = await setPaymentCall();
            console.log("Set payment call success:", setPaymentResult);
            await uriCall();
            
          } catch (error) {
            console.error("Error during file upload or set payment call:", error);
          }

        }}
        theme="dark"
        disabled={isSettingPayment}
      >
        Set Payment (MATIC)
      </Web3Button>
        </div>
      </>
        ) : (
          <>
          <div className="course-title-container">
              <p className="course-title">{courseInfo?.title}</p>
          </div>
          <div className="course-details">
              {courseInfo ? (
                  <>
                      <p className="description">{courseInfo?.description}</p>
                      <p className="card-media">Time Commitment: {courseInfo?.timeCommitment} hrs</p>
                      <p className="card-media">
                          Course Start:{" "}
                          {new Date(courseInfo.startDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZoneName: "short"
                          })}
                      </p>
                  </>
              ) : (
                  <p>Loading course information...</p>
          )}
        </div>
        <a href={`https://polygonscan.com/address/${item.data.courseId}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className="card">{isLoadingStudentDeposit ? <p>Loading...</p> : <p className="course-card">Your Stake: {studentDeposit && ethers.utils.formatEther(studentDeposit.toString())} MATIC </p>}
            <div>{isLoadingPayment ? <p>Loading...</p> : <p className="course-card">Sponsorship Required: {payment && ethers.utils.formatEther(payment.toString())} MATIC</p>}</div>
            <div>{isLoadingSponsorshipTotal ? <p>Loading...</p> : <p className="course-card">Currently Sponsored: {sponsorshipTotal && ethers.utils.formatEther(sponsorshipTotal.toString())} MATIC </p>}</div>
            <div></div>
            {isLoadingPayment || isLoadingSponsorshipTotal ? (
              <p>Loading...</p>
            ) : (
              <p className="course-card">
                Still Need:{" "}
                {payment && sponsorshipTotal
                  ? ethers.utils.formatEther(
                      payment.sub(sponsorshipTotal).toString()
                  )
                    : 0}{" "}
                  MATIC to Start Course
              </p>
            )}
            <div className="card-media">
              {courseInfo && courseInfo.syllabus && (
                <MediaRenderer
                  src={courseInfo.syllabus}
                  height={50}
                  width={100}
                  alt="Syllabus"
                  className="card-media"
                />
              )}
            </div>
            </div></a>
            <details className="actions student-actions">
              <summary>Student Actions</summary>
              <div>{isLoadingStudentStake ? <p>Loading...</p> : <p>Enrollment Fee: {studentStake && ethers.utils.formatEther(studentStake.toString())} MATIC</p>}</div>

              {/* <Web3Button
                contractAddress={item.data.courseId}
                action={uriCall}
                theme="dark"
              >
                Open Syllabus
              </Web3Button> */}
              <Web3Button
                contractAddress={item.data.courseId}
                action={enrollCall}
                theme="dark"
                overrides={{
                  value: studentStake,
                }}
              >
                Enroll
              </Web3Button>
              <Web3Button
                contractAddress={item.data.courseId}
                action={withdrawCall}
                theme="dark"
              >
                Withdraw
              </Web3Button>
              <Web3Button
                contractAddress={item.data.courseId}
                action={dropCall}
                theme="dark"
              >
                Dropout
              </Web3Button>
              
            </details>

            <details className="actions sponsor-actions">
              <summary>Sponsor Actions</summary>
              <input
                type="number"
                min="0"
                step="0.000000000000000001"
                value={sponsorAmount === '0' ? '' : sponsorAmount}
                onChange={(s) => {
                  const value = s.target.value;
                  if (!isNaN(value) && Number(value) >= 0) {
                    setSponsorAmount(value);
                  } else {
                    setSponsorAmount('0');
                  }
                }}
                placeholder="Enter amount in MATIC"
              />
              <Web3Button
                contractAddress={item.data.courseId}
                action={sponsorCall}
                theme="dark"
                overrides={{
                  value: sponsorAmountInWei,
                }}
              >
                Sponsor
              </Web3Button>
              <Web3Button
                contractAddress={item.data.courseId}
                action={unsponsorCall}
                theme="dark"
              >
                Unsponsor
              </Web3Button>
            </details>

            <details className="actions teacher-actions">
              <summary>Teacher Actions</summary>
              <Web3Button
                contractAddress={item.data.courseId}
                action={startCourseCall}
                theme="dark"
              >
                Start Course
              </Web3Button>
              <input type="text" string={studentAddress} onChange={(a) => setStudentAddress(a.target.value)} placeholder="Enter the Student Address you with to Pass/Boot" />
              <Web3Button
                contractAddress={item.data.courseId}
                action={passCall}
                theme="dark"
              >
                Pass Student
              </Web3Button>
              <Web3Button
                contractAddress={item.data.courseId}
                action={bootCall}
                theme="dark"
              >
                Boot Student
              </Web3Button>
              <Web3Button
                contractAddress={item.data.courseId}
                action={claimCall}
                theme="dark"
              >
                Claim Payout
              </Web3Button>
            </details>
          </>
        )}
      </>
    )}
  </div>
  </div>
);
}