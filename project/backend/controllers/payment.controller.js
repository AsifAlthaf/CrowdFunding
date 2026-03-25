import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

export const createOrder = async (req, res) => {
  try {
    const { amount, projectId } = req.body;

    if (!amount || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and project ID are required'
      });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `project_${projectId}_${Date.now()}`,
      notes: {
        projectId,
        userId: req.user.id
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const crypto = await import('crypto');
    const hmac = crypto.default.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret');
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpaySignature) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
