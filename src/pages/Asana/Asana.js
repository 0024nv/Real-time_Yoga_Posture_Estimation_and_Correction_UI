import React, { useEffect, useRef, useState } from 'react';
import './Asana.css';
import { useParams } from 'react-router-dom';
import { io } from "socket.io-client";
import * as mp from '@mediapipe/pose';



const Asana = () => {
    const videoRef = useRef(null);
    // const socket = useRef(null);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState({});
    const [stream, setStream] = useState(null);
    const [showAsanaImage, setShowAsanaImage] = useState(false); // Toggle to show/hide asana image
    const [animationFrameId, setAnimationFrameId] = useState(null);
    const [sendFrameVar, setsendFrameVar] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const asanas = [
        {
            id: 1,
            name: 'Padmasana',
            imageUrl: '/Image/pad2.jpg',
            instructions: [
                "1. Sit on the floor with your pelvis in a gentle posterior tilt and your knees bent, separated, and resting in an easy crossed position (right leg on top).",
                "2. Hold your right calf with both hands, and rotate your tibia (shinbone) away from you (laterally). Keeping that rotation, close your knee by drawing your right heel toward your navel.",
                "3. Extend through your right foot in plantar flexion (toes pressing down). Place your right foot into the crease of your left hip, and reach through your right femur (thighbone) so that your right knee moves down toward the floor.",
                "4. Repeat steps 2–3 on your left side so that both legs are bound. Your left leg should now be on top with both knees dropped down toward the floor.",
                "5. Allow your spine to rise up vibrantly from the center of your pelvis. Release your soft palate by visualizing space across the base of your skull, and allow your gaze to soften down the line of your nose. Your chin may be lifted or dropped. Straighten your arms, and rest the backs of your hands on your knees. Take Jnana Mudra by bringing together the tips of your thumbs and index fingers and straightening the other fingers.",
                "6. As you draw your breath in, gently lift your pubic bone and spread your lower back. Find a subtle toning action in your pelvic floor. As you exhale, feel sensation rise up your spine, through your heart, and to your soft palate. Allow any thoughts or images that began to form on the inhale to dissolve back into the emptiness of your body. Stay for at least 10 breaths."
            ]
        },
        {
            id: 2,
            name: 'Savasana',
            imageUrl: '/Image/sava2.jpg',
            instructions: [
                "1. Lying on your back, let the arms and legs drop open, with the arms about 45 degrees from the side of your body. Make sure you are warm and comfortable, if you need to place blankets under or over your body.",
                "2. Close the eyes, and take slow deep breaths through the nose. Allow your whole body to become soft and heavy, letting it relax into the floor. As the body relaxes, feel the whole body rising and falling with each breath.",
                "3. Scan the body from the toes to the fingers to the crown of the head, looking for tension, tightness and contracted muscles. Consciously release and relax any areas that you find. If you need to, rock or wiggle parts of your body from side to side to encourage further release.",
                "4. Release all control of the breath, the mind, and the body. Let your body move deeper and deeper into a state of total relaxation.",
                "5. Stay in Shavasana for 5 to 15 minutes.",
                "6. To release: slowly deepen the breath, wiggle the fingers and toes, reach the arms over your head and stretch the whole body, exhale bend the knees into the chest and roll over to one side coming into a fetal position. When you are ready, slowly inhale up to a seated position."
            ]
        },
        {
            id: 3,
            name: 'Bhujangasana',
            imageUrl: '/Image/bhuj1.avif',
            instructions: [
                "1. Lie on your belly, with the chin on the floor, palms flat on the floor under the shoulders and legs together.",
                "2. Pull up the knee caps, squeeze the thighs and buttocks, engage mula bandha, and press the pubic bone down into the floor.",
                "3. Without using the arms, inhale and lift the head and chest off of the floor, keeping the neck in line with the spine.",
                "4. With the elbows close to your sides, press down into the palms and use the arms to lift you up even higher. Drop the shoulders down and back and press the chest forward. Keep the legs, buttocks, and mula bandha strong, and keep the pubic bone pressing down into the floor.",
                "5. Breathe and hold for 2-6 breaths.",
                "6. To release: exhale and slowly lower the chest and head to the floor. Turn the head to one side and rest, rock the hips from side to side to release any tension in the low back."
            ]
        },
        {
            id: 4,
            name: 'Trikonasana',
            imageUrl: '/Image/trik2.avif',
            instructions: [
                "1. From a standing position with the legs 3 feet apart as in Five Pointed Star, turn the right toes to the right wall and the left toes slightly inwards.Inhale and press the left hips out to the left as you slide both arms to the right parallel to the floor.",
                "2. Exhale and rotate only the arms, raising the left arm up and resting the right hand against the right leg, with the palms facing forward.",
                "3. Press into the feet, pull up the knee caps, keeping the legs strong.Reach the finger tips away from each other, bringing the arms into one straight line with the shoulders stacked on top of each other.Press the left hip forward and the right hip back.",
                "4. Breathe and hold for 3 - 6 breaths.",
                "5. To release: inhale and reach the raised hand up towards the ceiling as you press down into the feet using the whole body to lift back into 5 pointed star.",
                "6. Repeat on the other side."
            ]
        },
        {
            id: 5,
            name: 'Janu Sirasana',
            imageUrl: '/Image/janu1.webp',
            instructions: [
                "1.Adjust the flesh under your seat so that your sit bones are firmly anchored.",
                "2.Bend your left knee and bring the sole of your left foot to your right inner thigh.",
                "3.Square your torso over your extended right leg. Begin to bring your torso down to your leg by tipping your pelvis forward and walking your hands which are framing your extended leg towards your right foot so that the bend initiates from your hips instead of your lower back.",
                "4.Keep your right foot flexed while pressing the back of the right thigh down toward the floor.",
                "5.When you reach your maximum forward bending limit, you have a choice: You can maintain your straight spine and long neck in an active position, or you can relax your heart and head down toward the extended leg, allowing the spine to round. Do whichever one feels better.",
                "6.If your hands reach your foot, hold your foot. If not, you may hold on to your ankle or calf, or place your hands on the floor wherever they reach.",
                "7.On each inhale, extend the spine long. On each exhale, deepen the forward bend.",
                "8.Stay here for five to 10 breaths and then straighten both legs, shake them out, and repeat the pose on the other side."
            ]
        },
        {
            id: 6,
            name: 'Tadasana',
            imageUrl: '/Image/tad1.avif',
            instructions: [
                "1.Stand with both feet touching from the heel to the big toe, keeping the back straight and the  arms pressed slightly against the sides with palms facing inward.",
                "2. Slightly tighten or flex the muscles in the knees, thighs, stomach and buttocks maintaining a firm  posture. Balance you weight evenly on both feet.",
                "3. Inhale through the nostrils and lift the buttocks off the legs arching the back and thrusting the  abdomen forward and tilt the head as far back as possible."
            ]
        },

    ];

    // const socket = useRef(null);

    const { id } = useParams();
    // console.log("targetId");
    // console.log(id);
    const targetAsana = asanas.find(asanas => asanas.id === parseInt(id));
    // console.log(targetAsana);


    useEffect(() => {
        // Show modal on page load
        setShowModal(true);
    }, []);

    const closeModal = () => {
        setShowModal(false);
    };

    const InstructionsModal = ({ onClose, targetAsana }) => {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className='modal-header'>
                        <div>
                            <h2>Instructions for {targetAsana.name}</h2>

                        </div>
                        <div className='modal-header-close'>
                            <div onClick={onClose} >❌</div>
                        </div>
                    </div>

                    {/* <p>These are the instructions for using this page...</p> */}
                    <div className='modal-content-instructions-box'>
                        {targetAsana && targetAsana.instructions.map((instruction, index) => (
                            <div className='modal-content-instructions' key={index}>{instruction}</div>
                        ))}
                    </div>

                </div>
            </div>
        );
    };


    useEffect(() => {

        const newSocket = io('http://127.0.0.1:5000/');
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to the Socket.IO server");
            // socket.emit("my event", {"data": "IDK"});
        });

        newSocket.on("message", (result) => {
            console.log("Received message from backend: ", result);
            setFeedback(result);
            console.log(feedback);
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from the Socket.IO server");
            setFeedback({});
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
                setFeedback({});
            }
        };

    }, []);

    useEffect(() => {
        return () => {
            // Clean up: Stop the camera stream when the component unmounts
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            // if(newSocket){
            //     newSocket.disconnect();
            // }
        };
    }, [stream]);

    const startVideo = async () => {
        try {
            const constraints = { video: true };
            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                setStream(newStream);
            }

            // setsendFrameVar(true);
            // console.log("Sendframevar");
            // console.log(sendFrameVar);

            // Send video frames to the backend
            // const mediaRecorder = new MediaRecorder(newStream);
            // mediaRecorder.ondataavailable = (event) => {
            //     if (event.data.size > 0) {
            //     // const blob = event.data;
            //     const reader = new FileReader();
            //     reader.onloadend = () => {
            //         const imageData = reader.result.split(',')[1];
            //         console.log("imagedata");
            //         console.log(imageData);
            //         if(socket)socket.emit('videoFrame', { imageData });
            //     };
            //     reader.readAsDataURL(event.data);
            //     }
            // };

            // mediaRecorder.start();

            // mediaRecorder.onerror = (error) => {
            //     console.error('Error sending video frame:', error);
            //     setError('Error sending video frame');
            // };


            // const sendFrame = () => {
            //     console.log("Sendframevar yha");
            //     console.log(sendFrameVar);
            //     if(sendFrameVar){
            //         // Capture the current frame from the video element
            //         const canvas = document.createElement('canvas');
            //         const context = canvas.getContext('2d');
            //         canvas.width = videoRef.current.videoWidth;
            //         canvas.height = videoRef.current.videoHeight;
            //         context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            //         // Convert the canvas content to base64
            //         const imageData = canvas.toDataURL('image/jpeg').split(',')[1];

            //         // Send the frame to the backend
            //         console.log("imagedata");
            //         if (socket) socket.emit('videoFrame', { imageData });

            //         // Request the next frame
            //         requestAnimationFrame(sendFrame);

            //     }
            // };

            // // Start sending frames
            // sendFrame();

        } catch (err) {
            console.error('Error accessing the camera:', err);
            setLoading(false);
            setError('Error accessing the camera. Please check your camera permissions.');
        }
    };

    const stopVideo = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }

        // Stop the animation frame
        // cancelAnimationFrame(animationFrameId);
        // setsendFrameVar(false);
        // setsendFrameVar(false);

    };


    useEffect(() => {
        let animationFrameId;
        let intervalId;

        const sendFrame = () => {
            if (stream && socket) {
                // console.log("sendframevar");
                // console.log(sendFrameVar);
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL('image/jpeg').split(',')[1];

                if (socket) socket.emit('videoFrame', { imageData });

                // animationFrameId = requestAnimationFrame(sendFrame);
            }
        };

        const startSendingFrames = () => {
            sendFrame(); // Send the first frame immediately
            intervalId = setInterval(sendFrame, 1000); // Send subsequent frames every 1 second
        };

        const stopSendingFrames = () => {
            clearInterval(intervalId); // Stop sending frames
        };

        if (stream) {
            startSendingFrames(); // Start sending frames if stream is available
        }

        return () => {
            if (stream) {
                stopSendingFrames(); // Stop sending frames when component unmounts
            }
        };

        // if(stream)sendFrame(); // Start sending frames immediately

        // return () => {
        //     if (animationFrameId) {
        //         cancelAnimationFrame(animationFrameId);
        //     }
        // };
    }, [stream, socket]);

    // return (
    //     <div className="asana-page">
    //         <h1>Perform Your Asana</h1>
    //         <div className="camera-feed">
    //             <video ref={videoRef} autoPlay playsInline></video>
    //             {showAsanaImage && (
    //                 <div className="asana-image-overlay">
    //                     {/* Display current asana image */}
    //                     {/* Example: <img src="asana_image_url.jpg" alt="Asana" /> */}
    //                     <img src={targetAsana.imageUrl} alt={targetAsana.name} />
    //                     <p>{targetAsana.name}</p>
    //                 </div>
    //             )}
    //         </div>
    //         <div className="video-controls">
    //             <button onClick={startVideo}>Start Video</button>
    //             <button onClick={stopVideo}>Stop Video</button>
    //             <button onClick={() => setShowAsanaImage(!showAsanaImage)}>
    //                 Toggle Asana Image
    //             </button>
    //         </div>
    //         <div className="asana-instructions">
    //             <h2>Asana Instructions</h2>
    //             {/* Display instructions for the asana */}
    //         </div>
    //         <div className="pose-feedback">
    //             <h2>Pose Feedback</h2>
    //             {/* Display feedback based on the user's pose */}
    //         </div>
    //     </div>
    // );

    return (
        <div className="asana-page">
            {showModal && <InstructionsModal onClose={closeModal} targetAsana={targetAsana} />}
            <h1>Perform {targetAsana.name}</h1>
            <div className="camera-feed">
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && (
                    <div >
                        <video ref={videoRef} autoPlay playsInline></video>
                        {
                            feedback ? (
                                feedback.status !== "Pose advice" ? (
                                    <div style={{ color: 'red' }}>{feedback.status}</div>
                                ) : (

                                    <div className='feedback-details'>
                                        {feedback.asana === targetAsana.asana ?
                                            (<div className='feedback-details'>
                                                <div style={{ color: 'red' }}>
                                                    Unable to detect {targetAsana.asana}! Please follow the instructions.
                                                </div>
                                            </div>)
                                            :
                                            (<div className='feedback-details'>
                                                <div>
                                                    Predicted Asana: {feedback.asana}
                                                </div>
                                                <div className='feedback-item'>
                                                    <div>
                                                        {feedback.left_shoulder == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Left Shoulder: {feedback.left_shoulder}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Left Shoulder: {feedback.left_shoulder}</div>)
                                                        }
                                                    </div>
                                                    <div>
                                                        {feedback.right_shoulder == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Right Shoulder: {feedback.right_shoulder}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Right Shoulder: {feedback.right_shoulder}</div>)
                                                        }
                                                    </div>
                                                </div>
                                                <div className='feedback-item'>
                                                    <div>
                                                        {feedback.left_elbow == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Left Elbow: {feedback.left_elbow}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Left Elbow: {feedback.left_elbow}</div>)
                                                        }
                                                    </div>
                                                    <div>
                                                        {feedback.right_elbow == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Right Elbow: {feedback.right_elbow}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Right Elbow: {feedback.right_elbow}</div>)
                                                        }
                                                    </div>
                                                </div>
                                                <div className='feedback-item'>
                                                    <div>
                                                        {feedback.left_hip == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Left Hip: {feedback.left_hip}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Left Hip: {feedback.left_hip}</div>)
                                                        }
                                                    </div>
                                                    <div>
                                                        {feedback.right_hip == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Right Hip: {feedback.right_hip}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Right Hip: {feedback.right_hip}</div>)
                                                        }
                                                    </div>
                                                </div>
                                                <div className='feedback-item'>
                                                    <div>
                                                        {feedback.left_knee == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Left Knee: {feedback.left_knee}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Left Knee: {feedback.left_knee}</div>)
                                                        }
                                                    </div>
                                                    <div>
                                                        {feedback.right_knee == "Correct" ?
                                                            (<div style={{ color: 'green' }}>Right Knee: {feedback.right_knee}</div>)
                                                            :
                                                            (<div style={{ color: 'red' }}>Right Knee: {feedback.right_knee}</div>)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }

                                    </div>

                                )
                            ) : null // Render nothing if feedback is not available
                        }
                        {/* {feedback && <p>{JSON.stringify(feedback)}</p>} */}
                    </div>
                )}
                {showAsanaImage && (
                    <div className="asana-image-overlay">
                        <img src={targetAsana.imageUrl} alt={targetAsana.name} />
                        <p>{targetAsana.name}</p>
                    </div>
                )}
            </div>
            <div className="video-controls">
                <button onClick={startVideo} disabled={loading}>
                    Start Video
                </button>
                <button onClick={stopVideo}>Stop Video</button>
                <button onClick={() => setShowAsanaImage(!showAsanaImage)}>
                    Asana Image
                </button>
                <button onClick={() => setShowModal(true)}>
                    Asana Instructions
                </button>
            </div>
            {/* <div className="asana-instructions">

                <h2>Asana Instructions</h2>
                
            </div> */}
            {/* <div className="pose-feedback">
                <h2>Pose Feedback</h2>
                <div>{feedback.status}</div>
                {feedback.status=="Pose advice" && (
                    <div>{feedback.left_shoulder}</div>
                )}
                
            </div> */}
        </div>
    );

};

export default Asana;