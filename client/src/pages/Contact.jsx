import React, { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('Thank you for your message! We will get back to you shortly.')
    // Here you would handle form submission (e.g., send to backend)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="input-primary mt-1"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="input-primary mt-1"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            value={formData.message}
            onChange={handleInputChange}
            className="input-primary mt-1 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn-primary px-6 py-3 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Send Message
        </button>
      </form>

      {status && <p className="mt-4 text-green-600 dark:text-green-400">{status}</p>}
    </div>
  )
}

export default Contact
