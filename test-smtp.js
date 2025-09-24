#!/usr/bin/env node

/**
 * Simple SMTP Test for Germany Meds OTP System
 * 
 * This script tests if your SMTP configuration is working
 * Run with: node test-smtp.js
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSMTP() {
  console.log('🧪 Testing SMTP Configuration for Germany Meds OTP System\n');
  
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ SMTP not configured in .env file');
    console.log('📝 Please add to your .env file:');
    console.log('   SMTP_HOST=your-smtp-host');
    console.log('   SMTP_PORT=587');
    console.log('   SMTP_USER=your-email@domain.com');
    console.log('   SMTP_PASS=your-password');
    console.log('   SMTP_FROM=your-email@domain.com');
    return;
  }
  
  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`📧 SMTP Port: ${process.env.SMTP_PORT || '587'}`);
  console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
  console.log(`📧 SMTP From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
  
  try {
    console.log('\n🔄 Testing SMTP connection...');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Test sending email
    console.log('\n📤 Testing email sending...');
    const testOTP = '123456';
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: "🧪 Germany Meds OTP Test",
      text: `Test OTP: ${testOTP}\n\nThis is a test email to verify SMTP configuration is working.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">🧪 SMTP Test Successful!</h2>
          <p>Your SMTP configuration is working correctly.</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <strong>Test OTP: ${testOTP}</strong>
          </div>
          <p>OTP emails will now be delivered to user inboxes!</p>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check your inbox: ${process.env.SMTP_USER}`);
    
    console.log('\n🎉 SMTP configuration is working!');
    console.log('✅ OTP emails will now be delivered to user inboxes');
    
  } catch (error) {
    console.log('❌ SMTP test failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check your SMTP username and password');
      console.log('2. Make sure your email provider allows SMTP');
      console.log('3. Check if you need to enable "Less secure app access"');
    } else if (error.message.includes('Connection timeout')) {
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check your SMTP host and port');
      console.log('2. Check your internet connection');
      console.log('3. Check firewall settings');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Possible fixes:');
      console.log('1. Check your SMTP_HOST is correct');
      console.log('2. Check your SMTP_PORT is correct');
      console.log('3. Make sure the SMTP server is running');
    }
  }
}

testSMTP().catch(console.error);
