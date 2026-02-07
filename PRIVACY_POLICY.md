# Privacy Policy

**Last Updated: February 7, 2026**

## 1. Introduction

This Privacy Policy explains how jule Discord Bot ("the Bot", "we", "us", or "our") collects, uses, stores, and protects your information when you use our services on Discord.

**By using the Bot, you consent to the data practices described in this policy.**

## 2. Information We Collect

### 2.1 Automatically Collected Data

When you use the Bot, we automatically collect:

#### User Data
- **User ID**: Your unique Discord user identifier
- **Username**: Your Discord username (for display purposes)
- **Avatar**: Your profile picture URL (for embeds and displays)
- **Discriminator**: Your Discord tag number (if applicable)

#### Server (Guild) Data
- **Server ID**: Unique identifier for Discord servers
- **Server Name**: Name of the server
- **Server Icon**: Server icon URL
- **Member Count**: Total members in the server
- **Channel IDs**: Channel identifiers where the Bot is used
- **Role IDs**: Role identifiers for permissions and auto-role features

#### Message Data
- **Message Content**: Only for XP calculation (not stored permanently)
- **Message Timestamps**: For cooldown tracking
- **Command Usage**: Commands you execute and their parameters

### 2.2 User-Generated Data

Data you actively provide through commands:

#### Economy System
- **Currency Balance**: Amount of virtual coins you own
- **Daily Claim Timestamp**: When you last claimed daily rewards
- **Work Cooldown**: When you last used the work command
- **Transaction History**: Record of earning/spending virtual currency

#### Leveling System
- **Experience Points (XP)**: Total XP accumulated
- **Level**: Your current level based on XP
- **Last XP Gain**: Timestamp for cooldown management
- **Rank Position**: Your position on the leaderboard

#### Moderation Data
- **Warnings**: Records of warnings received
- **Case IDs**: Moderation case numbers
- **Moderation Reasons**: Reason provided for moderation actions
- **Moderator IDs**: Who performed moderation actions
- **Timestamps**: When moderation actions occurred

#### Server Configuration
- **Welcome Channel**: Configured welcome message channel
- **Goodbye Channel**: Configured goodbye message channel
- **Moderation Log Channel**: Channel for moderation logs
- **Auto-Role**: Role assigned to new members automatically

### 2.3 Data We Do NOT Collect

We do **NOT** collect:
- ❌ Private messages or DMs
- ❌ Messages in channels where the Bot is not present
- ❌ Voice chat audio or recordings
- ❌ Real names, email addresses, or phone numbers (unless voluntarily shared in messages)
- ❌ Payment information (the Bot has no paid features)
- ❌ Precise geolocation data
- ❌ Biometric data
- ❌ IP addresses

## 3. How We Use Your Information

### 3.1 Primary Purposes

We use collected data to:

- **Provide Core Functionality**: Process commands and deliver Bot features
- **Economy System**: Track currency balances and transactions
- **Leveling System**: Calculate XP, levels, and display leaderboards
- **Moderation**: Maintain moderation logs and warning history
- **Auto-Features**: Send welcome/goodbye messages and assign auto-roles
- **Cooldown Management**: Prevent command spam and enforce limits
- **User Identification**: Display usernames and avatars in embeds
- **Server Configuration**: Remember and apply server-specific settings

### 3.2 Legitimate Interests

We process data based on legitimate interests to:

- **Improve Service Quality**: Analyze usage patterns to enhance features
- **Prevent Abuse**: Detect and prevent exploits, spam, and violations
- **System Maintenance**: Backup data and perform technical maintenance
- **Bug Fixes**: Identify and resolve technical issues

### 3.3 Legal Compliance

We may use data to:

- Comply with applicable laws and regulations
- Respond to legal requests (subpoenas, court orders)
- Protect our rights and property
- Prevent fraud or security issues

## 4. How We Store Your Information

### 4.1 Storage Method

- **Database Type**: JSON-based file storage (`database/main.json`)
- **Location**: Local server or hosting environment where the Bot runs
- **Format**: Plain text JSON (human-readable)
- **Encryption**: Data at rest is encrypted by the hosting provider

### 4.2 Data Structure

Data is organized by:
- **User ID**: Individual user records
- **Server ID**: Server-specific configurations
- **Collections**: Separate sections for economy, leveling, moderation, and config

### 4.3 Access Control

- Only Bot administrators have direct access to the database
- Discord users can view their own data through commands (`/balance`, `/rank`)
- Server administrators cannot access Bot database files directly

### 4.4 Backups

- Regular backups may be performed for disaster recovery
- Backups are stored securely in the same environment
- Backup retention follows the same policies as production data

## 5. Data Retention

### 5.1 Active Data

While you actively use the Bot:
- **Economy Data**: Retained indefinitely while account is active
- **Leveling Data**: Retained indefinitely while account is active
- **Moderation Logs**: Retained for server records
- **Server Configuration**: Retained while Bot is in the server

### 5.2 Deletion Triggers

Data may be automatically deleted when:
- The Bot is removed from a server (server-specific config)
- A user leaves all servers with the Bot (after 90 days of inactivity)
- Data deletion is requested (see Section 7)

### 5.3 Retention Periods

- **Moderation Logs**: Retained for up to 2 years or until deletion requested
- **Economy/Leveling Data**: Retained until account inactivity (90 days) or deletion
- **Server Configurations**: Deleted within 30 days of Bot removal
- **Temporary Data**: Message content for XP is not stored beyond processing

## 6. Data Sharing and Disclosure

### 6.1 We Do NOT Sell Your Data

We will never sell, rent, or trade your personal information to third parties for marketing purposes.

### 6.2 Limited Sharing

We may share data only in these circumstances:

#### Discord Platform
- Data is processed through Discord's API
- Discord's own Privacy Policy applies
- User IDs and server IDs are Discord identifiers

#### Public Display
- Leaderboards show usernames and stats publicly
- Rank cards display your username and avatar
- Server members may see your moderation history if configured

#### Service Providers
- Hosting providers (e.g., Railway, AWS, DigitalOcean) may have technical access
- Data processors are bound by confidentiality agreements

#### Legal Requirements
- Law enforcement requests with valid legal basis
- Court orders or subpoenas
- Protection of our legal rights

### 6.3 No Third-Party Analytics

We do not use third-party analytics services like Google Analytics.

## 7. Your Rights and Choices

### 7.1 Right to Access

You can:
- View your economy balance: `/balance`
- View your leveling data: `/rank`
- Request full data export by contacting us

### 7.2 Right to Deletion

You may request deletion of your data by:
- Contacting us through our support server or GitHub
- Specifying what data you want deleted
- Providing your Discord User ID for verification

**We will respond within 30 days and delete data within 60 days.**

### 7.3 Right to Correction

If your data is inaccurate:
- Contact us to request corrections
- Some data (like XP/currency) can be manually adjusted if incorrectly recorded

### 7.4 Right to Object

You may object to processing by:
- Stopping use of the Bot
- Requesting data deletion
- Removing the Bot from your server

### 7.5 Right to Data Portability

You can request a copy of your data in JSON format by contacting us.

## 8. Children's Privacy (COPPA Compliance)

### 8.1 Age Restrictions

- The Bot is designed for users **13 years or older** (Discord's minimum age)
- We do not knowingly collect data from children under 13
- If we discover data from users under 13, we will delete it immediately

### 8.2 Parental Rights

Parents/guardians may:
- Request deletion of their child's data
- Review what data has been collected
- Contact us with privacy concerns

## 9. International Data Transfers

### 9.1 Data Location

Data may be stored and processed in:
- The region where the Bot is hosted
- Discord's servers (globally distributed)

### 9.2 Cross-Border Transfers

If you are outside the Bot's hosting region:
- Your data may be transferred internationally
- We ensure adequate safeguards are in place
- By using the Bot, you consent to these transfers

## 10. Security Measures

### 10.1 Technical Safeguards

We implement:
- **Access Controls**: Limited administrator access
- **Secure Storage**: Encrypted hosting environments
- **Regular Updates**: Security patches and dependency updates
- **Monitoring**: Logs for detecting unauthorized access

### 10.2 Organizational Measures

- **Data Minimization**: Collect only necessary data
- **Staff Training**: Administrators understand privacy obligations
- **Incident Response**: Procedures for handling data breaches

### 10.3 Limitations

No system is 100% secure. We cannot guarantee absolute security but maintain industry-standard protections.

## 11. Data Breach Notification

In the event of a data breach:
- We will investigate within 72 hours
- Affected users will be notified via Discord or Bot announcements
- Notification will include what data was affected and remediation steps
- We will report to authorities if legally required

## 12. Cookies and Tracking

### 12.1 No Web Cookies

The Bot does not use web cookies (it operates solely within Discord).

### 12.2 Discord Tracking

Discord itself may use cookies and tracking. See [Discord's Privacy Policy](https://discord.com/privacy).

### 12.3 Cooldown Tracking

We track command usage timestamps to enforce cooldowns (daily rewards, work, XP). This is essential for Bot functionality.

## 13. Third-Party Links

The Bot may display links to external websites. We are not responsible for the privacy practices of these sites. Review their privacy policies before providing information.

## 14. Changes to This Privacy Policy

### 14.1 Updates

We may update this policy to reflect:
- Changes in data practices
- New features or services
- Legal or regulatory requirements

### 14.2 Notification

When we make changes:
- The "Last Updated" date will be revised
- Material changes will be announced in the Bot or support server
- Continued use constitutes acceptance of changes

### 14.3 Review

We recommend reviewing this policy periodically.

## 15. GDPR Compliance (For EU Users)

If you are in the European Economic Area (EEA):

### 15.1 Legal Basis for Processing

- **Consent**: By using the Bot
- **Legitimate Interests**: Service operation and improvement
- **Contractual Necessity**: To provide requested services

### 15.2 Your GDPR Rights

- Right to access your data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restrict processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent

### 15.3 Supervisory Authority

You have the right to lodge a complaint with your local data protection authority.

## 16. CCPA Compliance (For California Users)

If you are a California resident:

### 16.1 Your Rights

- Right to know what personal information is collected
- Right to know if personal information is sold (we do not sell data)
- Right to delete personal information
- Right to opt-out of sale (not applicable, as we don't sell data)
- Right to non-discrimination for exercising your rights

### 16.2 Requests

To exercise CCPA rights, contact us with your User ID and specific request.

## 17. Contact Information

For privacy-related questions, requests, or concerns:

### Primary Contact
- **Discord Support Server**: https://discord.gg/DBsu7Fs
- **GitHub Issues**: https://github.com/juleskuy/jule
- **Email**: zulfann2299@gmail.com

### Response Time
We will respond to privacy requests within:
- **30 days** for general inquiries
- **45 days** for GDPR/CCPA requests (may extend to 90 days if complex)

## 18. Consent

By using jule Discord Bot, you consent to:
- Collection of data as described in this policy
- Processing of data for stated purposes
- Storage of data in our database systems
- International data transfers (if applicable)

## 19. How to Withdraw Consent

You may withdraw consent at any time by:
1. Stopping use of the Bot
2. Requesting data deletion (see Section 7)
3. Removing the Bot from your server

Withdrawal does not affect the lawfulness of processing before withdrawal.

## 20. Data We Share Publicly

The following data may be visible to other Discord users:

- **Leaderboard Rankings**: Username, level, XP, rank position
- **Rank Cards**: Username, avatar, level, XP, progress
- **Balance Display**: Username and currency amount
- **Moderation Logs**: Username, moderator, action, reason (in configured channels)

If you prefer privacy, avoid using commands that display public information.

## 21. Transparency Report

We are committed to transparency. Upon request, we can provide:
- Number of data deletion requests processed
- Number of legal data requests received
- Data breach incidents (if any)

## 22. Acknowledgment

BY USING THE BOT, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO THIS PRIVACY POLICY.

---

**jule Discord Bot** • Built with discord.js v14 and TypeScript • MIT License

**Your privacy matters to us.** If you have any questions or concerns, please don't hesitate to contact us.
