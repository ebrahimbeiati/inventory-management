"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, AlertCircle, Mail, HelpCircle, Package, Users, BarChart2, Settings } from 'lucide-react';

// FAQ item interface
interface FAQItem {
  question: string;
  answer: string;
}

// Help section interface
interface HelpSection {
  title: string;
  icon: JSX.Element;
  content: string;
  faqs: FAQItem[];
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  
  // Toggle section expansion
  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(section => section !== title) 
        : [...prev, title]
    );
  };
  
  // Toggle FAQ expansion
  const toggleFaq = (question: string) => {
    setExpandedFaqs(prev => 
      prev.includes(question) 
        ? prev.filter(faq => faq !== question) 
        : [...prev, question]
    );
  };
  
  // Define help sections
  const helpSections: HelpSection[] = [
    {
      title: "Getting Started",
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      content: "Welcome to Inventory Pro! This guide will help you get started with the system and learn about its key features.",
      faqs: [
        {
          question: "How do I log in to the system?",
          answer: "Use your email and password to log in at the login page. If you're accessing the system for the first time, contact your administrator for login credentials."
        },
        {
          question: "What if I forgot my password?",
          answer: "Click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password."
        },
        {
          question: "How do I navigate the system?",
          answer: "Use the sidebar on the left to navigate between different sections of the application. The sidebar can be collapsed on mobile devices by clicking the menu icon."
        }
      ]
    },
    {
      title: "Products Management",
      icon: <Package className="w-5 h-5 text-green-500" />,
      content: "Learn how to manage your inventory products, including adding, editing, and deleting products.",
      faqs: [
        {
          question: "How do I add a new product?",
          answer: "Go to the Products page and click on the 'Add Product' button. Fill in the required fields in the form and click 'Save' to add the product to your inventory."
        },
        {
          question: "How do I edit a product?",
          answer: "On the Products page, find the product you want to edit and click the 'Edit' button (pencil icon). Make your changes in the form and click 'Save'."
        },
        {
          question: "Can I bulk update products?",
          answer: "Yes! Go to the 'Bulk Update' page from the sidebar or the Products page. You can update multiple products at once by uploading a CSV file or selecting products from the list."
        },
        {
          question: "How do I filter and search for products?",
          answer: "Use the search bar at the top of the Products page to search by name. You can also use the filter options to filter by category, tag, or other attributes."
        }
      ]
    },
    {
      title: "User Management",
      icon: <Users className="w-5 h-5 text-purple-500" />,
      content: "Learn how to manage user accounts, including creating new users, assigning roles, and managing permissions.",
      faqs: [
        {
          question: "How do I add a new user?",
          answer: "Go to the Users page and click on the 'Add User' button. Fill in the user's details including email, name, and role, then click 'Save'."
        },
        {
          question: "What are the different user roles?",
          answer: "The system has three main roles: Admin, Manager, and Employee. Admins have full access to all features, Managers can manage inventory but have limited access to system settings, and Employees have basic access for day-to-day operations."
        },
        {
          question: "How do I deactivate a user?",
          answer: "Go to the Users page, find the user you want to deactivate, and click the 'Status' toggle or select 'Deactivate' from the actions menu."
        }
      ]
    },
    {
      title: "Dashboard & Reports",
      icon: <BarChart2 className="w-5 h-5 text-orange-500" />,
      content: "Learn how to use the dashboard and reports to gain insights into your inventory and business performance.",
      faqs: [
        {
          question: "What information is shown on the dashboard?",
          answer: "The dashboard shows key metrics including total products, low stock items, recent activities, and sales performance. You can customize the dashboard widgets based on your preferences."
        },
        {
          question: "How do I generate reports?",
          answer: "Go to the Reports section from the sidebar. Select the type of report you want to generate, set the date range and other filters, then click 'Generate Report'."
        },
        {
          question: "Can I export reports?",
          answer: "Yes, you can export reports in various formats including PDF, Excel, and CSV. Look for the 'Export' button at the top of the report page."
        }
      ]
    },
    {
      title: "Settings",
      icon: <Settings className="w-5 h-5 text-gray-500" />,
      content: "Learn how to configure system settings, including notifications, appearance, and account settings.",
      faqs: [
        {
          question: "How do I change my password?",
          answer: "Go to Settings > Account, and click on 'Change Password'. Enter your current password and your new password, then click 'Save'."
        },
        {
          question: "How do I enable dark mode?",
          answer: "Click on the appearance toggle in the top right corner of the screen, or go to Settings > Appearance and select 'Dark Mode'."
        },
        {
          question: "How do I set up email notifications?",
          answer: "Go to Settings > Notifications. You can configure which events trigger email notifications and set up notification preferences."
        }
      ]
    }
  ];
  
  // Filter sections based on search term
  const filteredSections = searchTerm
    ? helpSections.map(section => ({
        ...section,
        faqs: section.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(section => 
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.faqs.length > 0
      )
    : helpSections;
  
  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Help Center</h1>
        <p className="text-gray-600 dark:text-gray-400">Find answers to common questions and learn how to use the system</p>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search for help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Help Content */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Section Header */}
            <div 
              className="p-4 cursor-pointer flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
              onClick={() => toggleSection(section.title)}
            >
              <div className="flex items-center space-x-2">
                {section.icon}
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">{section.title}</h2>
              </div>
              {expandedSections.includes(section.title) ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
            
            {/* Section Content */}
            {expandedSections.includes(section.title) && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{section.content}</p>
                
                {/* FAQs */}
                <div className="space-y-3">
                  {section.faqs.map((faq) => (
                    <div key={faq.question} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                      <div 
                        className="p-3 bg-white dark:bg-gray-800 cursor-pointer flex justify-between items-center"
                        onClick={() => toggleFaq(faq.question)}
                      >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                        {expandedFaqs.includes(faq.question) ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      
                      {expandedFaqs.includes(faq.question) && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Additional Help */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Need more help?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          If you couldn't find the answer you're looking for, please contact our support team.
        </p>
        <div className="flex items-center space-x-4">
          <a href="mailto:support@inventorypro.com" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
} 