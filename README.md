# Angular Project README

Welcome to our Angular project! This project aims to provide a robust solution for user management, technical support, content management, and other features.

## Table of Contents

- [Modules](#modules)
  - [Onboarding Module](#onboarding-module)
  - [User Management Module](#user-management-module)
  - [CMS Module](#cms-module)
  - [Sub Admin Module](#sub-admin-module)
  - [Notification Module](#notification-module)
  - [Dashboard Module](#dashboard-module)
  - [Admin Profile](#admin-profile)
  - [Job Management](#job-management)
  - [Request Management](#request-management)
  - [Incident/Report Management](#incident/report-management)
  - [Support](#support)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Modules

### Onboarding Module

The Onboarding module is responsible for managing user registration, login, forgot password, and resetting passwords.

- **Login**: Users can authenticate using their credentials.
- **Forgot Password**: Users can reset their password by providing their email address and receiving a reset password link.
- **Reset Password**: Users can set a new password after following the reset password link.

### User Management Module

The User Management module handles user listing, search, filtering, and actions related to user accounts.

- **Listing**: Display a list of registered users.
- **Search**: Allow users to search for specific users based on criteria.
- **Filtering**: Provide options to filter users by various attributes.
- **Actions**: Admins can perform actions on user accounts, such as deleting, update status .
- **User Details**: Admins can view detailed information about a specific user, including their preferences.
- **Add User**: Admins can add any user.

### CMS Module

The CMS (Content Management System) module manages static content such as About Us, Our Vision, Terms of use, Privacy Policy, FAQs, and support pages.


- **About Us**: This page contains information about the organization, its mission, and its values.

- **Terms of Use**: Users can view the terms and conditions governing the use of the platform or services.

- **Privacy Policy**: This page outlines the policies regarding user privacy and data handling, ensuring transparency and compliance with regulations.

- **FAQs (Frequently Asked Questions)**: This section provides answers to common queries users may have, helping to address concerns and provide clarity.

### Dashboard Module

The Dashboard module provides an overview of various statistics and counts related to the platform.

- **Counts**: Display counts for Users, Jobs, and other relevant metrics.
- **Date Filter**: Include a date filter to allow users to filter data based on a specific date range.

### Admin Profile

The Admin Profile module allows administrators to manage their profile settings.

- **Change Picture**: Admins can upload or change their profile picture.
- **Change Name**: Admins can update their display name.
- **Change Password**: Admins can update their login password.

### Notification Module

The Notification module handles the management of notifications for users.

- **Listing**: Display a list of notifications.
- **Search**: Allow users to search for specific notifications based on criteria.
- **Filtering**: Provide options to filter notifications by various attributes.
- **Add Notification**: Admins can create and send notifications to selected users.

### Sub Admin Module

The SubAdmin module manages the listing, searching, and filtering of SubAdmins, as well as the addition of new SubAdmins.

- **Listing**: Display a list of registered SubAdmins.
- **Search**: Allow users to search for specific SubAdmins based on criteria.
- **Filtering**: Provide options to filter SubAdmins by various attributes.
- **Add Button**: Admins can add new SubAdmins using the add button.

### Job Management

The job module manages the listing, searching, and filtering of job, as well as the addition of new job.

- **Listing**: Display a list of registered job.
- **Search**: Allow users to search for specific job title.
- **Filtering**: Provide options to filter job by various attributes.
- **Add Button**: Admins can add new job using the add button.
- **Schedule Button**: Admin can schedule any job.

### Incident/Report Management

The incident/report module manages the listing, searching, and filtering of report.

- **Listing**: Display a list of registered report.
- **Search**: Allow users to search for specific description and reported by user.
- **Filtering**: Provide options to filter job by various attributes.
- **Details**: Admins can view detailed information about a specific report.

### Request Management

The request module manages the listing, searching, and filtering of request.

- **Listing**: Display a list of registered request.
- **Search**: Allow users to search for name.
- **Filtering**: Provide options to filter request by various attributes.
- **Details**: Admins can view detailed information about a specific request.

### Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Usage

To use this project, follow these steps:

1. Clone the repository.
2. Install dependencies using npm or yarn.
3. Start the development server.

```bash
git clone https://github.com/benendufresne/CoBuild-Admin.git
cd your-angular-project
npm install --force
ng serve




