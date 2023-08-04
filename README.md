# 🏛️ Peace Antz Academy
## A Decentralized School Contract for Online Learning and Talent Scouting

Welcome to the Peace Antz Academy! Our decentralized school contract is a smart contract that revolutionizes online learning and talent scouting by seamlessly connecting teachers, sponsors, and students on the blockchain.

## 🌟 Features
- **Course Creation**: Teachers can create and market courses. They are also responsible for preparing POAPs (Proof of Attendance Protocols) for each class, which define the length and milestones of the course.
- **Staking and Sponsorship**: Students need to stake funds to enroll in courses. Teachers get paid by sponsors for teaching. Sponsors can also scout talent.
- **Ranking and Statistics**: The system maintains rankings and statistics for teachers, students, and sponsors.
- **Decentralized and Transparent**: The smart contract is executed on the blockchain, ensuring a decentralized and transparent mechanism.

## 🚀 Getting Started

Try it out at [Peace Antz Academy](https://www.PeaceAntzAcademy.com/academy)

To get started with Peace Antz Academy, follow these steps:

1. Install Node.js and npm if you haven't already. You can download them from [here](https://nodejs.org/).

2. Clone the repository:

   ```bash
   git clone https://github.com/Peace-Antz/AcademyBuild.git

3.  Navigate to the project directory:

    `cd AcademyBuild`

4.  Install the required dependencies:

    `npm install`

5.  Start the development server:

    `npm start`

You should now be able to access the Peace Antz Academy Dapp at `http://localhost:3000`.

🔧 Implementation
-----------------

The Peace Antz Academy consists of two main contracts:

1.  Course Factory Contract (Peace Antz Academy Contract)
2.  Course Contract

### Course Factory Contract

-   Written in Solidity, deployable on any EVM-compatible blockchain.
-   Allows teachers to deploy new course contracts.
-   Maintains ranking information for teachers, students, and sponsors.
-   Records academy-wide statistics including total value locked (TVL), total sponsored, total staked, total payouts, and a "fail fund".
-   Ensures that functions are only called by recognized course contracts through the `isValid()` modifier.
-   Updates rankings and academy information based on course-related events.

### Course Contract

-   Facilitates the setup and operation of an online course system.
-   Teachers have control over the course status and payment.
-   Students can enroll by staking currency, and receive their stake back if they pass.
-   Sponsors can deposit funds, which can be withdrawn by the teacher upon course completion.

📖 Usage
--------

### As a Teacher

1.  Deploy the contract with your address and the Course Factory address.
2.  Set the payment amount for the course using `setAmount()` (be sure to Upload Course Information and Syllabus).
3.  Start the course using `updateCourseStatus()`.
4.  Pass students who complete the course using `passStudent()`.
5.  Claim the sponsored payment using `claimPayment()`.

### As a Student

1.  Enroll in a course using `enroll()` with the required stake.
2.  To leave before the course starts, use `withdraw()`.
3.  To drop out after the course starts, use `dropOut()`.
4.  Once you pass the course you will get staked amount back. If you fail, the stake goes to the Peace Antz Council to develop the Dapp further.

### As a Sponsor

1.  Sponsor a course using `sponsor()`.
2.  To withdraw your sponsorship before the course begins, use `unsponsor()`.
3.  Off-chain relationships is a key for leveraging teacher to recruit talent for your needs.

🔐 Dependencies
---------------

-   The contract utilizes OpenZeppelin's Access Control contract for access control functionalities.
-   It also uses the Initializable contract for initializing the contract in an upgradeable context.
-   The front end used Thirdweb as a layer of abstraction for publishing contracts and building out the front end.

⚠️ Disclaimer
-------------

Please be advised that this contract has not been audited. Use at your own risk.

✨ Benefits
----------

-   For Teachers: Earn money by teaching courses and have the freedom to define course length and milestones.
-   For Students: Learn important skills for free upon successful completion of the course.
-   For Sponsors: Scout talent and invest in skills they want to hire.
-   Authenticity and Transparency: The use of smart contracts and blockchain technology ensure the authenticity of the course and completion certificates, and blockchain implementation ensures transparency.

🎓 Conclusion
-------------

The Peace Antz Academy Dapp is an innovative solution that can revolutionize the way we think about online learning and talent scouting. It provides a transparent, decentralized, and efficient mechanism for connecting teachers, sponsors, and students on the blockchain. With a focus on course creation, stakeholding, completion certificates, and rankings, it benefits all parties involved and can be easily implemented on any blockchain platform that supports smart contracts.

Join us in this revolutionary approach to online learning and talent scouting.

![image](https://github.com/Peace-Antz/PeaceAntzAcademy/assets/16519706/9e34c4ed-976e-4eba-8fde-11b38a96eae3)

![image](https://github.com/Peace-Antz/PeaceAntzAcademy/assets/16519706/34a6bd3c-ab3d-478c-8289-e89bfac38ae8)

* * * * *

> Note: This README is intended to provide an overview of the Peace Antz Academy Dapp. For detailed implementation and interaction with the smart contracts, please refer to the contract code and accompanying documentation.

📚 Documentation
----------------

For more information about how to use the Peace Antz Academy Dapp, check out the [website](https://www.peaceantzacademy.com/about).

📝 License
----------

This project is licensed under the terms of the [MIT license](https://github.com/Peace-Antz/AcademyBuild/blob/main/LICENSE.md).

🤝 Contributing
---------------

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/Peace-Antz/AcademyBuild/issues).

💬 Get in Touch
---------------

For any questions, suggestions, join our discord at <https://discord.gg/beFycZz6SN>.

🙌 Acknowledgements
-------------------

-   Thanks to OpenAI for providing AI code assistance!
-   Thanks to Thirdweb for probiding a user friendly way to interact with the blockchain!
