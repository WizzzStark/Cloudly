# ☁️ Cloudly - Your Secure Cloud Storage Solution

Welcome to Cloudly, the ultimate cloud storage solution designed to cater to your organizational and personal needs. Cloudly provides a seamless and secure way to upload, manage, and share your files, including images, PDFs, and CSVs, across the web. This platform is built using the latest technologies including NextJS for the frontend, Clerk for authentication, and Convex for our database operations to ensure your data is safe and accessible at all times.

## 🌟 Features

- **📁 File Uploads:** Securely upload images, PDFs, and CSV files.
- **🏢 Organizations:** Support for organizations to manage files in a collective environment.
- **👤 User profile:** Profile settings including name, photo, connected accounts, active devices, change password, etc...
- **👑 User Roles:** Roles in organizations to improve the logic of what users can perform some actions.
- **⭐ Favorites:** Mark files as favorites for quick access.
- **🔍 Indexed search in database:** Indexed search to filter files easily
- **⏲️ Cron Tasks:** Automated tasks to move unused files to the Trash folder, ensuring your storage is optimized without permanently losing your data.
- **🗑️ Trash System:** Deleted files are moved to Trash for a certain period before permanent deletion, allowing for recovery if needed.
- **🔽 Download Files:** Download your uploaded files or visualize them.
- **🔄 Recovery File System:** Recover your files from the Trash easily or delete them forever.
- **🔒 Secure Authentication:** Powered by Convex, providing a secure and reliable login system.
- **📄 Table or Grid view:** Support for both table and grid view to improve UX
- **💾 Efficient Data Management:** Utilizing Clerk for seamless database management and operations.

## 🛠 Technologies Used

- **🖥 Frontend:** NextJS
- **🔐 Authentication:** Clerk
- **📊 Database Management:** Convex

## 📦 Installation Guide

### Prerequisites

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 
- npm

### Setting Up the Project

1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/cloudly.git
cd cloudly
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create a `.env.local` file at the root of your project and add the necessary environment variables:

```env
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_HOSTNAME=
NEXT_PUBLIC_CONVEX_SITE_URL=
```
4. **Run de Backend**
```bash
npx convex dev
```

5. **Run the Development Server**

```bash
npm run dev
```

This will start the development server on [http://localhost:3000](http://localhost:3000). Navigate to this URL to view the application.

## 📈 How to Use

- **Uploading Files:** Navigate to the upload section, choose your file, and click upload.
- **Managing Organizations:** Access the organization tab to create or join an existing organization.
- **Accessing Favorites and Trash:** Use the sidebar to switch between different views such as Favorites and Trash.

## 📸 Screenshots
![624shots_so](https://github.com/WizzzStark/Cloudly/assets/85120579/5510dd02-f819-42ca-8cc5-3f684a69eb7b)

![760shots_so](https://github.com/WizzzStark/Cloudly/assets/85120579/31537b0b-5a50-4cdc-b14e-01dc57b16755)

![882shots_so](https://github.com/WizzzStark/Cloudly/assets/85120579/f75e32c0-ff55-4ee3-9ea1-d6798524095b)

## 🤝 Contributing

We welcome contributions! Please feel free to fork the repository and submit pull requests with your improvements.

## 📜 License

Cloudly is open-source software licensed under the MIT license.

