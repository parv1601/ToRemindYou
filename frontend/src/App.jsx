import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
    CalendarCheck, Heart, Menu, X, Trash2, CheckCircle, Gift, 
    Sparkles, RefreshCw, Layers, Moon, Zap, ArrowRight, CornerDownRight, Mail
} from 'lucide-react';

// --- CONFIGURATION & STYLING ---
// IMPORTANT: Adjust this if your backend is running on a different port/address
const API_URL = 'http://localhost:5000/api'; 
// Anniversay Milestone Date
const ANNIVERSARY_DAY = 17;
const ANNIVERSARY_MONTH = 8; // August (1-indexed for display)

// --- COLOR PALETTE (From User) ---
const PRIMARY_BLUE = '#4C5FD5'; 
const LIGHT_ACCENT = '#dadbf1'; 
const PRIMARY_TEXT = '#000000'; 
const WHITE = '#fff';

// --- HELPER FUNCTIONS ---

/**
 * Calculates the number of days left until the next monthly milestone (the 17th).
 */
const calculateNextMonthlyDate = (targetDay) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let nextDate = new Date(now.getFullYear(), now.getMonth(), targetDay);

    if (nextDate < today) {
        nextDate.setMonth(nextDate.getMonth() + 1);
    }
    
    const difference = nextDate.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    
    // Using 'en-IN' for Indian date format context
    return { days, targetDateString: nextDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) };
};

/**
 * Calculates the number of days left until the next annual anniversary (Aug 17th).
 */
const calculateNextAnnualDate = (targetMonth, targetDay) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let targetDate = new Date(now.getFullYear(), targetMonth - 1, targetDay);

    if (targetDate < today) {
        targetDate = new Date(now.getFullYear() + 1, targetMonth - 1, targetDay);
    }

    const difference = targetDate.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    
    return { days, targetYear: targetDate.getFullYear() };
};

// --- NEOBRUTALIST STYLED COMPONENTS ---

const Card = ({ children, className = '', style = {} }) => (
    <div 
        className={`bg-white p-6 rounded-xl border-2 border-black ${className}`} 
        style={{ 
            backgroundColor: WHITE, // Enforce White BG
            boxShadow: `8px 8px 0px 0px ${PRIMARY_TEXT}`, // Neobrutalist Shadow
            ...style 
        }}
    >
        {children}
    </div>
);

const AestheticButton = ({ children, onClick, className = '', disabled = false, icon: Icon, type = 'button', style = {} }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{ backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_TEXT, color: WHITE, boxShadow: disabled ? 'none' : `4px 4px 0px 0px ${PRIMARY_TEXT}`, ...style }}
        className={`w-full p-4 flex items-center justify-center space-x-2 border-2 rounded-lg font-bold text-lg 
                    hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100
                    disabled:bg-gray-400 disabled:shadow-none ${className}`}
    >
        {Icon && <Icon size={20} />}
        <span>{children}</span>
    </button>
);

// --- Header Component ---

const Header = () => {
    const [userName, setUserName] = useState('My Love');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch the user data
                const res = await axios.get(`${API_URL}/users`);
                setUserName(res.data.name);
            } catch (err) {
                setUserName('Sweetheart');
            }
        };
        fetchUser();
    }, []);

    const navItems = [
        { path: '/', name: 'Dashboard', icon: Heart },
        { path: '/tasks', name: 'My Routine', icon: CalendarCheck },
        { path: '/wishes', name: 'Wants Portal', icon: Gift },
    ];

    return (
        <header 
            style={{ backgroundColor: WHITE, borderBottom: `2px solid ${PRIMARY_TEXT}` }}
            className="fixed top-0 left-0 w-full z-50 shadow-md"
        >
            <div 
                // CRITICAL FIX: Ensure header content is constrained and centered
                style={{ maxWidth: '420px', margin: '0 auto' }} 
                className="flex items-center justify-between p-4 w-full"
            >
                <h1 className="text-xl font-serif font-bold tracking-wider" style={{ color: PRIMARY_TEXT }}>
                    Yoo <span style={{ color: PRIMARY_BLUE }}>Hot Bitch!</span>
                </h1>
                
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="p-2 border-2 border-black rounded-lg"
                    style={{ color: PRIMARY_TEXT, boxShadow: '2px 2px 0px 0px #000' }}
                    aria-label="Toggle navigation menu"
                >
                    {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown - Neobrutalist Styled */}
            {isMenuOpen && (
                <nav className="absolute top-full left-0 w-full shadow-2xl border-t-2 border-black" style={{ backgroundColor: WHITE }}>
                    <ul className="flex flex-col p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center space-x-3 p-3 border-2 border-black rounded-lg font-bold transition duration-150 ${
                                            isActive 
                                                ? 'bg-white'
                                                : 'bg-white hover:bg-gray-50'
                                        }`}
                                        style={isActive ? { backgroundColor: LIGHT_ACCENT, color: PRIMARY_BLUE, boxShadow: '3px 3px 0px 0px #000' } : { color: PRIMARY_TEXT }}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                        <ArrowRight size={18} className='ml-auto' />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            )}
        </header>
    );
};

// --- Email Setup Modal Component ---

const EmailSetupModal = ({ onSetupComplete }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Simple email format validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError("Please enter a valid email address.");
                setLoading(false);
                return;
            }

            // Call backend to update user email
            await axios.put(`${API_URL}/users/email`, { email });
            
            // Success: Update localStorage and complete setup
            localStorage.setItem('userEmailSet', 'true');
            onSetupComplete();
        } catch (err) {
            console.error('Email setup failed:', err);
            setError(err.response?.data?.error || 'Failed to save email. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
            <Card style={{ boxShadow: `12px 12px 0px 0px ${PRIMARY_TEXT}` }} className="w-full max-w-xs text-center p-8">
                <Mail size={32} className="mx-auto mb-4" style={{ color: PRIMARY_BLUE }}/>
                <h3 className="text-xl font-bold mb-2 font-serif" style={{ color: PRIMARY_TEXT }}>Welcome!</h3>
                <p className="text-sm text-stone-700 mb-6">
                    Enter the email Brinda uses to receive personalized task reminders.
                </p>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border-2 rounded-lg transition duration-150 text-base"
                        style={{ borderColor: PRIMARY_TEXT, color: PRIMARY_TEXT, boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                        required
                        disabled={loading}
                    />
                    
                    {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

                    <AestheticButton type="submit" icon={ArrowRight} disabled={loading}>
                        {loading ? 'Saving...' : 'Set Up Reminders'}
                    </AestheticButton>
                </form>
            </Card>
        </div>
    );
};


// --- PAGE COMPONENTS ---

const Dashboard = () => {
    const { days: annualDays, targetYear } = calculateNextAnnualDate(ANNIVERSARY_MONTH, ANNIVERSARY_DAY);
    const { days: monthlyDays, targetDateString } = calculateNextMonthlyDate(ANNIVERSARY_DAY);
    const isCelebrationDay = new Date().getDate() === ANNIVERSARY_DAY;
    
    // --- Random Phrase Logic ---
    const supportivePhrases = [
        "Cute u r.",
        "Overactions u shouldn't do.",
        "Drink some water.",
        "Cwezy cwezy.",
        "U r hot if u didn't know.",
        "That waist!!!!!.",
    ];
    
    const [currentPhrase, setCurrentPhrase] = useState('');

    useEffect(() => {
        // Select a random phrase once when the component mounts
        const randomPhrase = supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];
        setCurrentPhrase(randomPhrase);
    }, []); 

    return (
        <div className="p-4 space-y-8">
            {isCelebrationDay && (
                <Card 
                    className="text-white animate-pulse-slow"
                    style={{ 
                        background: PRIMARY_BLUE,
                        boxShadow: `8px 8px 0px 0px ${PRIMARY_TEXT}`,
                        color: WHITE
                    }}
                >
                    <h2 className="text-2xl font-extrabold mb-1 font-serif flex items-center justify-center space-x-2">
                        <Heart size={28} className="animate-wiggle" />
                        <span>IT'S THE 17TH!</span>
                    </h2>
                    <p className="font-medium text-sm mt-2">
                        Happy Monthly Anniversary!!!!!!
                    </p>
                </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Card className="text-center shadow-lg" style={{ boxShadow: `4px 4px 0px 0px ${PRIMARY_TEXT}` }}>
                    <h2 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: PRIMARY_BLUE }}>
                        Next 17th
                    </h2>
                    <p className="text-5xl font-extrabold leading-none" style={{ color: PRIMARY_BLUE }}>
                        {monthlyDays}
                    </p>
                    <p className="text-sm font-medium text-stone-700 mt-2">
                        Days until {targetDateString}
                    </p>
                </Card>
                
                <Card className="text-center shadow-lg" style={{ boxShadow: `4px 4px 0px 0px ${PRIMARY_TEXT}` }}>
                    <h2 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: PRIMARY_BLUE }}>
                        Next Big Anniversary
                    </h2 >
                    <p className="text-5xl font-extrabold leading-none" style={{ color: PRIMARY_TEXT }}>
                        {annualDays}
                    </p>
                    <p className="text-sm font-medium text-stone-700 mt-2">
                        Days until Aug {ANNIVERSARY_DAY}, {targetYear}
                    </p>
                </Card>
            </div>

            <Card 
                className="border-l-4" 
                style={{ borderLeftColor: PRIMARY_BLUE, backgroundColor: LIGHT_ACCENT, boxShadow: `8px 8px 0px 0px ${PRIMARY_TEXT}` }}
            >
                <h3 className="text-base font-serif font-semibold mb-2 flex items-center space-x-2" style={{ color: PRIMARY_BLUE }}>
                    <Sparkles size={18} /> A Thought Just For You
                </h3>
                {/* Display the random phrase */}
                <p className="italic font-medium text-lg" style={{ color: PRIMARY_TEXT }}>
                    "{currentPhrase}"
                </p>
                
            </Card>
        </div>
    );
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [recurrenceDays, setRecurrenceDays] = useState(7);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState({ show: false, text: '', success: false });

    // State for Custom Confirmation Modal
    const [isConfirming, setIsConfirming] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const showToast = (text, success = true) => {
        setToastMessage({ show: true, text, success });
        setTimeout(() => setToastMessage({ show: false, text: '', success: false }), 3000);
    };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL + '/tasks');
            setTasks(res.data);
        } catch (err) {
            showToast('Failed to load tasks.', false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskName || !recurrenceDays) return;

        try {
            const res = await axios.post(API_URL + '/tasks', {
                name: taskName,
                recurrenceDays: Number(recurrenceDays),
            });
            setTasks([res.data, ...tasks]); 
            setTaskName('');
            setRecurrenceDays(7);
            showToast('Task scheduled successfully!');
        } catch (err) {
            showToast('Failed to add task.', false);
        }
    };

    // Opens the custom modal
    const handleDelete = (task) => {
        setTaskToDelete(task);
        setIsConfirming(true);
    };

    // Executes the deletion after confirmation
    const confirmDelete = async () => {
        if (!taskToDelete) return;
        const id = taskToDelete._id;
        const name = taskToDelete.name;

        setIsConfirming(false); // Close modal
        setTaskToDelete(null); 

        try {
            await axios.delete(`${API_URL}/tasks/${id}`); 
            
            setTasks(tasks.filter(task => task._id !== id));
            showToast(`"${name}" removed from schedule.`, true); 
        } catch (err) {
            console.error('Failed to delete task:', err);
            showToast('Failed to delete task. Backend server issue.', false);
        }
    };

    const cancelDelete = () => {
        setIsConfirming(false);
        setTaskToDelete(null);
        showToast('Deletion cancelled.', false);
    };
    
    const handleMarkDone = async (task) => {
        try {
            const res = await axios.put(`${API_URL}/tasks/${task._id}`, {
                lastSentDate: new Date().toISOString(),
            });
            
            setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
            showToast(`"${task.name}" completed! Timer reset.`, true);
            
        } catch (err) {
            showToast('Failed to mark as done.', false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-3xl font-serif font-bold mb-4" style={{ color: PRIMARY_TEXT }}>My Routine</h2>
            
            {/* Task Creation Form (Neobrutalist Card) */}
            <form 
                onSubmit={handleSubmit} 
                className="bg-white p-6 rounded-xl border-2 border-black"
                style={{ boxShadow: `8px 8px 0px 0px ${PRIMARY_TEXT}` }}
            >
                <p className="text-base font-semibold text-stone-700 mb-4 flex items-center space-x-2" style={{ color: PRIMARY_TEXT }}>
                    <Layers size={20} style={{ color: PRIMARY_BLUE }}/> <span>Schedule New Recurring Task</span>
                </p>
                <input 
                    type="text" 
                    placeholder="Task Name (e.g., Eyebrows, Clean Kitchen)"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full p-3 mb-3 border-2 rounded-lg focus:ring-0 transition duration-150"
                    style={{ borderColor: PRIMARY_TEXT, color: PRIMARY_TEXT, boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                    required
                />
                <div className="flex space-x-3 items-center">
                    <input 
                        type="number" 
                        placeholder="Days"
                        value={recurrenceDays}
                        onChange={(e) => setRecurrenceDays(e.target.value)}
                        min="1"
                        className="w-1/3 p-3 border-2 rounded-lg text-center font-bold transition duration-150"
                        style={{ borderColor: PRIMARY_TEXT, color: PRIMARY_TEXT, boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                        required
                    />
                    <AestheticButton type="submit" className='flex-1' disabled={!taskName || !recurrenceDays} icon={RefreshCw}>
                        Set Recurrence
                    </AestheticButton>
                </div>
            </form>

            {/* Task List */}
            <h3 className="text-xl font-serif font-bold mb-2 mt-6 flex items-center space-x-2" style={{ color: PRIMARY_TEXT }}>
                <CalendarCheck size={20} style={{ color: PRIMARY_BLUE }}/><span>Scheduled Items ({tasks.length})</span>
            </h3>
            
            {loading ? (
                <div className="p-4 text-center text-gray-500"><Moon size={24} className='animate-spin mx-auto' style={{ color: PRIMARY_BLUE }}/></div>
            ) : tasks.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed rounded-xl bg-white" style={{ borderColor: PRIMARY_TEXT, color: PRIMARY_TEXT }}>
                    You haven't added any recurring tasks yet!
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div 
                            key={task._id} 
                            className="bg-white p-4 rounded-xl border-2 border-black flex items-center justify-between transition duration-150"
                            style={{ boxShadow: `4px 4px 0px 0px ${PRIMARY_TEXT}` }}
                        >
                            <div className="flex-1 pr-4">
                                <p className="text-lg font-bold flex items-center space-x-2" style={{ color: PRIMARY_TEXT }}>
                                    <CornerDownRight size={18} style={{ color: PRIMARY_BLUE }} />
                                    <span>{task.name}</span>
                                </p>
                                <p className="text-xs text-stone-500 mt-1">
                                    Reminds every <span className='font-semibold'>{task.recurrenceDays} day(s)</span>.
                                </p>
                                <p className="text-xs mt-1" style={{ color: PRIMARY_BLUE }}>
                                    Last Done: {new Date(task.lastSentDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => handleMarkDone(task)}
                                    className="p-3 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition"
                                    title="Mark as Done & Reset Timer"
                                    style={{ border: `2px solid ${PRIMARY_TEXT}`, boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                                >
                                    <CheckCircle size={20} />
                                </button>
                                <button 
                                    // Calls the new handleDelete to open the modal
                                    onClick={() => handleDelete(task)}
                                    className="p-3 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition"
                                    title="Delete Task"
                                    style={{ border: `2px solid ${PRIMARY_TEXT}`, boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Aesthetic Toast Notification */}
            {toastMessage.show && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-xl font-semibold transition-all duration-300 transform border-2 border-black 
                                ${toastMessage.success ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {toastMessage.text}
                </div>
            )}

            {/* CUSTOM NEOBRUTALIST CONFIRMATION MODAL */}
            {isConfirming && taskToDelete && (
                <div 
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={cancelDelete} // Close on backdrop click
                >
                    <Card 
                        className="w-full max-w-xs text-center p-6"
                        style={{ boxShadow: `10px 10px 0px 0px ${PRIMARY_TEXT}` }}
                        onClick={(e) => e.stopPropagation()} // Keep modal open on click inside
                    >
                        <Trash2 size={32} className="mx-auto mb-4" style={{ color: 'red' }}/>
                        <h3 className="text-xl font-bold mb-2">Confirm Delete</h3>
                        <p className="text-sm text-stone-700 mb-6">
                            Are you sure you want to remove the task: 
                            <span className="font-extrabold block mt-1" style={{ color: PRIMARY_BLUE }}>{taskToDelete.name}</span>?
                        </p>

                        <div className="flex space-x-3">
                            <button 
                                onClick={cancelDelete}
                                className="flex-1 p-3 border-2 border-black rounded-lg font-bold transition hover:bg-gray-200"
                                style={{ backgroundColor: WHITE, boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 p-3 text-white border-2 border-black rounded-lg font-bold transition hover:bg-red-600"
                                style={{ backgroundColor: 'red', boxShadow: `2px 2px 0px 0px ${PRIMARY_TEXT}` }}
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

const WantsPortal = () => {
    const [wishMessage, setWishMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!wishMessage.trim()) return;

        setIsLoading(true);
        setStatus('');
        setIsSuccess(false);

        try {
            await axios.post(API_URL + '/wishes', { message: wishMessage });

            setStatus('Wish received! The Admin has been instantly notified. 😉');
            setIsSuccess(true);
            setWishMessage('');
        } catch (error) {
            setStatus('Failed to send wish. Please try again later.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6 text-center">
            <Card style={{ boxShadow: `8px 8px 0px 0px ${PRIMARY_TEXT}` }}>
                <Gift size={40} className="mx-auto mb-3 animate-bounce-slow" style={{ color: PRIMARY_BLUE }}/>
                <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: PRIMARY_TEXT }}>The Wants Portal</h2>
                <p className="text-stone-600 mb-6 font-light italic">
                    Tell the universe (and me!) your desires. What can make you smile today?
                </p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="E.g., I wish for a surprise trip to the mountains..."
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                        rows="5"
                        className="w-full p-4 border-2 rounded-xl transition duration-150 resize-none mb-6 shadow-inner text-lg"
                        style={{ borderColor: PRIMARY_TEXT, color: PRIMARY_TEXT, boxShadow: `4px 4px 0px 0px ${PRIMARY_TEXT}` }}
                        disabled={isLoading}
                        required
                    />

                    <AestheticButton type="submit" icon={Zap} disabled={isLoading || !wishMessage.trim()}>
                        {isLoading ? 'Sending Magic...' : 'Manifest My Wish!'}
                    </AestheticButton>
                </form>

                {status && (
                    <p className={`mt-4 text-sm font-medium ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </Card>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App = () => {
    // State to check if email is set (stored in localStorage)
    const [isEmailSet, setIsEmailSet] = useState(localStorage.getItem('userEmailSet') === 'true');

    // Callback to run after the email is successfully saved via the modal
    const handleEmailSetupComplete = useCallback(() => {
        setIsEmailSet(true);
    }, []);

    // Effect to check if email is set on initial load (optional, but good practice)
    useEffect(() => {
        if (!isEmailSet) {
            // Check if the email is already in the DB by hitting the /users endpoint
            // (If the backend has the email, we can bypass the modal.)
            const checkEmailStatus = async () => {
                try {
                    const res = await axios.get(`${API_URL}/users`);
                    if (res.data.email) {
                        localStorage.setItem('userEmailSet', 'true');
                        setIsEmailSet(true);
                    }
                } catch (e) {
                    console.warn("Backend user check failed. Assuming email is not set.");
                }
            };
            checkEmailStatus();
        }
    }, [isEmailSet]);


    return (
        // CRITICAL FIX: Ensure background and mobile constraints are applied via style
        <div 
            className="min-h-screen font-sans antialiased"
            style={{ backgroundColor: LIGHT_ACCENT, color: PRIMARY_TEXT, margin: '0 auto', maxWidth: '420px', minHeight: '100vh' }}
        >
            <Router>
                {/* Conditionally render the email setup modal */}
                {!isEmailSet && <EmailSetupModal onSetupComplete={handleEmailSetupComplete} />}

                <Header />
                {/* Main content area */}
                <main className="pt-24 pb-8 w-full min-h-screen"> 
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/wishes" element={<WantsPortal />} />
                    </Routes>
                </main>
            </Router>
        </div>
    );
};

export default App;