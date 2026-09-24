import axios from 'axios'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

export const razorpayService = {
  // Create order in Razorpay
  async createOrder(amount, orderId, customerDetails) {
    try {
      // Call your backend to create Razorpay order
      const { data } = await axios.post('/api/razorpay/create-order', {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: orderId,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      })

      return data
    } catch (err) {
      console.error('Razorpay order creation failed:', err)
      throw err
    }
  },

  // Initialize Razorpay payment
  async initiatePayment(razorpayOrder, orderDetails) {
    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'Shionix',
        description: `Order #${orderDetails.id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: orderDetails.customer_name,
          email: orderDetails.customer_email,
          contact: orderDetails.customer_phone,
        },
        theme: {
          color: '#0066FF',
        },
        handler: function (response) {
          resolve(response)
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled by user'))
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  },

  // Verify payment signature
  async verifyPayment(paymentData) {
    try {
      const { data } = await axios.post('/api/razorpay/verify-payment', {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      })

      return data
    } catch (err) {
      console.error('Payment verification failed:', err)
      throw err
    }
  },
}
