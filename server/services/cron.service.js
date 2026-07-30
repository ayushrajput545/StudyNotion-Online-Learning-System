const cron = require('node-cron');
const axios = require('axios');
const exceljs = require('exceljs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendExcelReport = async () => {
    try {
        console.log("Running scheduled task to fetch courses and send report...");

        //call api to keep the server alive - if server is sleeping then it will wake up
        const response = await axios.get(`https://studynotion-ed-tech-platform-2-ic89.onrender.com/api/v1/course/getAllCourses`);

        console.log("Courses data fetched successfully.");

        if (!response.data.success) {
            console.log("Failed to fetch courses data.");
            return;
        }

        const courses = response.data.data;

        // Create Excel Workbook
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Courses Report');

        // Define columns
        worksheet.columns = [
            { header: 'Course Name', key: 'courseName', width: 30 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Instructor Name', key: 'instructor', width: 30 },
            { header: 'Instructor Email', key: 'instructorEmail', width: 30 },
            { header: 'Category Name', key: 'category', width: 25 },
            { header: 'Students Enrolled', key: 'studentsEnrolled', width: 20 },
        ];

        // Add Data
        courses.forEach(course => {
            worksheet.addRow({
                courseName: course.courseName || 'N/A',
                price: course.price !== undefined ? course.price : 'N/A',
                instructor: course.instructor ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() : 'N/A',
                instructorEmail: course.instructor ? course.instructor.email : 'N/A',
                category: course.category ? course.category.name : 'N/A',
                studentsEnrolled: course.studentsEnrolled ? course.studentsEnrolled.length : 0
            });
        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Send Email
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from: 'Studynotion || Codehelp by --Ayush',
            to: 'officialboy545@gmail.com',
            subject: 'Daily Courses Report',
            html: '<p>Please find attached the daily courses report, including information related to courses, purchases, instructor info, and category info.</p>',
            attachments: [
                {
                    filename: 'Courses_Report.xlsx',
                    content: buffer,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            ]
        });

        console.log(`Excel report successfully sent: ${info.messageId}`);
    } catch (error) {
        console.error("Error in scheduled task:", error.message);
    }
};

// Scheduled for midnight every day
cron.schedule("0 0 * * *", sendExcelReport);

// Expose the function for manual execution or testing
module.exports = { sendExcelReport };