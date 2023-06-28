# Moodlechain

A plugin developed for [Moodle LMS](https://moodle.com/solutions/lms/). Designed to further support universities to ensure integrity of grades and transparency of the grading process when managing grades in Moodle.

# Overview

This plugin works together with a private Blockchain where course managers can save grades and retrieve them to verify their integrity over time.

The moodlechain/ folder holds all the plugin files. This plugin belongs to the [Gradebook reports](https://docs.moodle.org/dev/Gradebook_reports) type and can be installed either from through Moodle UI(Site administration>Plugins>Install plugin) or directly in the moodle/grade/report/ folder of the Moodle source code.

The privateblock-contract/ folder holds the smart contract we developed to work with the plugin.

The blockchain network is up to user's choice, we used the [Ganache and Truffle](https://trufflesuite.com/ganache/) suite to test the plugin and the contract.

# Thesis info
This was developed as part of my master's thesis with name "Implementation of a Moodle plugin to manage university grades with Blockchain".

In recent years, Blockchain has become increasingly popular as it offers a new approach to storing and sharing data. It is a network of distributed nodes that interact with each other and handle data in a way that ensures their integrity without requiring trust  in a central authority. This decentralized nature of the solution serves to increase the security of the data and has paved the way for many new and innovative applications based on Blockchain. 

Moodle is a widely used free Learning Management System, software for conducting online courses via the Internet, offering integrated e-learning services. Being open-source free software, it gives developers the opportunity to retrieve and extend it by developing new features, it gives developers the opportunity to retrieve and extend it by developing new features. In this way, an ecosystem of educational applications is created on top of Moodle through a now quite mature plugin creating mechanism.

Combining the above, the subject of this thesis is the exploitation of Blockchain technology in the development of a plugin for Moodle, which uses Blockchain to improve the integrity and security of the grade management process through Moodle. Initially, a study of the Moodle ecosystem will be carried out, especially the plugin development mechanism, which will the be used to develop a new plugin that will connect to a suitable private Blockchain network with the aim of ensuring that the grades entered for each course remain secure without the possibility of alteration. The documentation of the plugin will be done according to the standards of Software Technology and the corresponding UML diagrams, in a way that highlights the architecture of the system.
