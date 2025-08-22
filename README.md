# HealthSense - AI Lab Report Analysis & Health Assistant

HealthSense is an intelligent AI-powered application that helps users understand their lab reports and get answers to general health questions. Built with modern web technologies and powered by Google's Gemini AI.

## 🌟 Features

- **Lab Report Analysis**: Upload PDF lab reports and get detailed, patient-friendly explanations
- **Health Q&A**: Ask general health questions and receive educational responses
- **AI-Powered Insights**: Powered by Google Gemini AI for accurate medical information
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Admin Dashboard**: Monitor usage analytics and interactions
- **Secure**: Built with security best practices and medical disclaimers

## 🚀 Live Demo

[Deployed on Vercel](https://healthsense-ai.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini API
- **PDF Processing**: PDF.js
- **Deployment**: Vercel
- **Styling**: Custom CSS with CSS Variables

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthsense.git
   cd healthsense
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## 📁 Project Structure

```
healthsense/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── index.html             # Main application page
├── dashboard.html         # Admin dashboard
├── vercel.json           # Vercel deployment config
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add `GEMINI_API_KEY` with your API key

### Manual Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically on push

## 🔒 Security Features

- Input validation and sanitization
- File size and type restrictions
- Rate limiting considerations
- Medical disclaimers and safety rules
- No medical diagnosis or advice

## 📱 Usage

### For Users
1. **Lab Report Analysis**: Upload a PDF lab report and get instant AI analysis
2. **Health Questions**: Ask general health questions in the chat interface
3. **Educational Content**: Receive clear, patient-friendly explanations

### For Administrators
1. Access the dashboard at `/dashboard.html`
2. Login with admin credentials
3. View analytics and interaction history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**IMPORTANT**: This application is for educational purposes only. It does not provide medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/healthsense/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

- **v1.0.0**: Initial release with lab report analysis
- **v1.1.0**: Added health Q&A functionality
- **v1.2.0**: Enhanced UI and responsive design
- **v1.3.0**: Vercel deployment and optimization

## 📊 Analytics

The application tracks:
- Total reports analyzed
- Common test types
- Average processing time
- User interactions

---

**Built with ❤️ for better health understanding**
