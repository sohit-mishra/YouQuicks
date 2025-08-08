import { useState } from 'react';
import { MdQuestionMark } from 'react-icons/md';
import { BiSolidMessageRounded } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/lib/toastUtils';
import { Toaster } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    link: '',
    request: '',
    subject: '',
    message: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, request: value }));
  };

  const isAnyFieldEmpty = Object.values(formData).some(value => value.trim() === '');

  const handleSubmit = async (e) => {
    e.preventDefault?.();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (formData.link && !urlRegex.test(formData.link)) {
      showErrorToast("Please enter a valid URL.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact/create`, formData);

      showSuccessToast("Message sent successfully!");
      setFormData({
        name: '',
        email: '',
        link: '',
        request: '',
        subject: '',
        message: '',
      });
      setDialogOpen(false);
    } catch (err) {
      console.log(err);
      showErrorToast(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <motion.section
        className="contact p-6 max-w-screen-xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h1 className="text-5xl mt-5 font-bold mb-4 text-center">Support Centre</h1>
        <p className="text-center w-full mb-2 mt-10">
          We respond to every inquiry within 24–72 hours. We do not respond to inquiries on Saturday & Sunday, but we do process orders.
        </p>

        <h2 className="text-center text-xl mb-8 mt-5 font-bold">
          Please review our FAQ to find an immediate answer before contacting us.
        </h2>

        <div className="w-full max-w-5xl mx-auto pt-6 pb-10 px-4 sm:px-6 md:px-8 lg:px-10 bg-gray-100 shadow-[0_0_42px_0px_rgb(194,194,194)] rounded-lg mb-6 flex flex-col md:flex-col items-center gap-6 text-center">
          <BiSolidMessageRounded className="text-5xl text-[#0abb87]" aria-hidden="true" />
          <div className="flex-1">
            <h2 className="font-semibold text-xl font-bold">
              To email us, use the <span className="italic">"Help"</span> widget in the bottom right corner.
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              Please include your YouTube channel URL in your message for quicker service.
            </p>
          </div>
        </div>

        <div className="mt-6 text-lg text-center text-gray-600">
          <p className="font-semibold mb-2">Hours of Operation:</p>
          <p className="text-green-600">• Monday, Wednesday, Friday: 8:00 AM – 6:00 PM</p>
          <p className="text-red-600">• Tuesday, Thursday, Saturday, Sunday: Closed</p>
        </div>
      </motion.section>

      {/* Help Button and Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full flex items-center px-4 py-2 shadow-lg hover:bg-green-700 transition-all"
          >
            <MdQuestionMark className="mr-2" />
            Help
          </motion.button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl font-bold">
              Contact Support
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 mb-4">
              Submit your issue or question using the form below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="link">YouTube Video URL</Label>
              <Input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <Label htmlFor="request">Request Topic</Label>
              <Select onValueChange={handleSelectChange} value={formData.request}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Subscribers">Subscribers</SelectItem>
                  <SelectItem value="Likes">Likes</SelectItem>
                  <SelectItem value="Comments">Comments</SelectItem>
                  <SelectItem value="Watch Hours">Watch Hours</SelectItem>
                  <SelectItem value="Affiliates">Affiliates</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Short Subject"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your detailed message here..."
                rows={4}
                className="w-full border rounded px-3 py-2 resize-none"
                required
              />
            </div>

            <AlertDialogFooter className="pt-4">
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button
                type="submit"
                disabled={isAnyFieldEmpty}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Send
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
