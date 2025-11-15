# Fathers Son Music

Christian music ministry website helping people from exclusive church backgrounds find and follow Christ Jesus through song.

## 🌐 Live Website

- **Production**: https://fatherssonmusic.pages.dev
- **Repository**: https://github.com/theezachyg/fatherssonmusic

## 📋 Features

- Single-page responsive design
- Audio streaming for 3 original Christian songs
- Interactive audio player with waveform visualization
- Contact form with email integration
- Donation/download modal system
- Privacy policy and terms & conditions
- Animated background and particle effects
- Mobile-responsive navigation

## 🚀 Deployment

This website is hosted on **Cloudflare Pages** and automatically deploys from the `main` branch.

### Automatic Deployments

To enable automatic deployments from GitHub:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **fatherssonmusic**
3. Go to **Settings** → **Builds & deployments**
4. Click **Connect to Git**
5. Select **GitHub** and authorize Cloudflare
6. Choose the `theezachyg/fatherssonmusic` repository
7. Set production branch to `main`

After setup, every push to `main` will automatically deploy!

### Manual Deployment

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=fatherssonmusic --branch=main
```

## 📁 Project Structure

```
fatherssonmusic/
├── index.html              # Main website file
├── assets/                 # Media assets
│   └── FathersSonMusic-Bgk.mp4
├── Media/                  # Audio files
│   ├── 1-Message_in_the_Song-Fathers_Son_Music.mp3
│   ├── 2-Grandpa_Joe-Fathers_Son_Music.mp3
│   └── 3-Spiritual_Abuse-Fathers_Son_Music.mp3
└── functions/              # Cloudflare Pages Functions (serverless)
    └── contact.js          # Contact form handler
```

## 🛠 Technologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Hosting**: Cloudflare Pages
- **Icons**: Font Awesome 6.4.0
- **Backend**: Cloudflare Pages Functions (serverless)

## 📧 Contact Form

The contact form uses Cloudflare Pages Functions to send emails. Form submissions are processed serverlessly and sent via email.

## 🎵 Songs

1. **Message In The Song** - A powerful reminder to test everything against Scripture
2. **Grandpa Nick** - A story about church splits and family healing
3. **Spiritual Abuse** - Finding freedom from spiritual manipulation

## 📄 License

© 2025 Fathers Son Music. All rights reserved.

## 💻 Development

Website designed and developed by **Instinctive Marketing, Technology & Design**
- Website: https://instinctive.xyz

---

*"It's not about the music—it's the message in the song."*
