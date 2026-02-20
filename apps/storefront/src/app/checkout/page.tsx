'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { ordersApi, authApi, couponsApi } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { ShieldCheck, RefreshCw, Truck, Banknote, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { isAuthenticated, login, user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial state matching the new requirement
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        altPhone: '', // Optional
        street: '', // Detailed Address
        city: '',
        country: 'Bangladesh', // Default or hidden
        note: '', // Note for Delivery
    });

    // For password if registering
    const [password, setPassword] = useState('');

    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'card'>('cod');
    const [termsAccepted, setTermsAccepted] = useState(false);

    // bKash payment details
    const [bkashSenderNumber, setBkashSenderNumber] = useState('');
    const [bkashTransactionId, setBkashTransactionId] = useState('');
    const BKASH_MERCHANT_NUMBER = '01XXXXXXXXX'; // Replace with actual merchant number

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ id: string, code: string, discountAmount: number } | null>(null);
    const [couponError, setCouponError] = useState('');
    const [isCouponLoading, setIsCouponLoading] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponError('');
        setIsCouponLoading(true);

        try {
            const subtotal = getTotalPrice();
            const response = await couponsApi.validate(couponCode, subtotal);
            setAppliedCoupon({
                id: response.data.id,
                code: response.data.code,
                discountAmount: response.data.discountAmount
            });
            toast.success(`Coupon "${response.data.code}" applied successfully!`);
            setCouponCode('');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Invalid coupon';
            setCouponError(message);
            toast.error(message);
            setAppliedCoupon(null);
        } finally {
            setIsCouponLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            alert('Please agree to the Terms & Conditions');
            return;
        }

        setLoading(true);

        try {
            // 1. Handle Registration if not authenticated
            if (!isAuthenticated) {
                if (!password) {
                    alert("Please create a password to register and complete your order.");
                    setLoading(false);
                    return;
                }

                // Validate password length
                if (password.length < 8) {
                    alert("Password must be at least 8 characters long.");
                    setLoading(false);
                    return;
                }

                try {
                    const { data } = await authApi.register(formData.fullName, formData.email, password);
                    if (data.token) {
                        const userData = {
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                            role: data.role
                        };
                        login(data.token, userData);
                    }
                } catch (regError: any) {
                    const errorMessage = regError.response?.data?.message || 'Registration failed';
                    alert(errorMessage);
                    setLoading(false);
                    return;
                }
            }

            // 2. Prepare Order Data
            const subtotal = getTotalPrice();
            const shipping = formData.city === 'Dhaka' ? 70 : 140;
            const discount = appliedCoupon?.discountAmount || 0;
            const total = subtotal + shipping - discount;
            // I'll stick to image logic: Subtotal + Shipping.

            const orderData = {
                orderItems: items.map((item) => ({
                    productId: item.productId,
                    variantSku: item.variantSku,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    altPhone: formData.altPhone,
                    street: formData.street,
                    city: formData.city,
                    state: '', // Not in UI
                    zip: '', // Not in UI
                    country: formData.country,
                    note: formData.note,
                },
                itemsPrice: subtotal,
                taxPrice: 0,
                shippingPrice: shipping,
                totalPrice: total,
                paymentMethod,
                couponCode: appliedCoupon?.code,
                discountAmount: appliedCoupon?.discountAmount || 0,
                ...(paymentMethod === 'bkash' && {
                    bkashNumber: bkashSenderNumber,
                    bkashTxnId: bkashTransactionId,
                }),
            };

            // 3. Create Order
            const response = await ordersApi.create(orderData);

            // 4. Handle Payment (Same logic)
            if (paymentMethod === 'card') {
                const { clientSecret } = response.data;
                const stripe = await stripePromise;
                if (!stripe || !clientSecret) throw new Error('Stripe initialization failed');
                const { error } = await stripe.confirmPayment({
                    clientSecret,
                    confirmParams: { return_url: `${window.location.origin}/account` },
                });
                if (error) {
                    toast.error(error.message);
                } else {
                    setIsSuccess(true);
                    toast.success('Order placed successfully!', {
                        description: 'Redirecting to your account...',
                    });
                    clearCart();
                }
            } else {
                setIsSuccess(true);
                toast.success('Order placed successfully!', {
                    description: 'Thank you for shopping with us.',
                    icon: <ShoppingBag className="h-5 w-5 text-green-600" />,
                    duration: 5000,
                });
                clearCart();
                router.push('/account');
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Order creation failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);

        // Redirect if cart is empty, unless we just successfully ordered
        if (!isSuccess && items.length === 0) {
            router.push('/cart');
        }
    }, [items.length, router, isSuccess]);

    if (!mounted) return null;

    const subtotal = getTotalPrice();
    const shipping = formData.city === 'Dhaka' ? 70 : 140;
    const discount = appliedCoupon?.discountAmount || 0;
    const total = subtotal + shipping - discount;

    return (
        <div className="min-h-screen bg-white py-12 lg:py-20">
            <div className="container mx-auto px-4">
                <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                                    <span className="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</span>
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block text-gray-900">Full Name <span className="text-red-500">*</span></label>
                                    <Input className="bg-white text-gray-900"
                                        placeholder="Enter your full name"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-900">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            readOnly={isAuthenticated}
                                            className={isAuthenticated ? 'bg-gray-100 text-gray-900' : 'bg-white'}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-900">Phone Number <span className="text-red-500">*</span></label>
                                        <Input className="bg-white"
                                            placeholder="01XXXXXXXXX"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                {!isAuthenticated && (
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-900">Create Password <span className="text-red-500">*</span></label>
                                        <Input className="bg-white"
                                            type="password"
                                            placeholder="Create a password for your account"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card className="border-none shadow-sm bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-900">
                                    <span className="h-5 w-5 bg-gray-200 rounded-full flex items-center justify-center text-xs">📍</span>
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block text-gray-900">Detailed Address <span className="text-red-500">*</span></label>
                                    <Input className="bg-white"
                                        placeholder="House, Road, Area"
                                        required
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-900">City / District <span className="text-red-500">*</span></label>
                                        <Select
                                            value={formData.city}
                                            onValueChange={(val) => setFormData({ ...formData, city: val })}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dhaka">Dhaka</SelectItem>
                                                <SelectItem value="Chittagong">Chittagong</SelectItem>
                                                <SelectItem value="Sylhet">Sylhet</SelectItem>
                                                {/* Add more cities */}
                                            </SelectContent>
                                        </Select>
                                        {!formData.city && <input tabIndex={-1} autoComplete="off" style={{ opacity: 0, height: 0 }} required={!formData.city} />}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block text-gray-900">Alt. Phone</label>
                                        <Input className="bg-white"
                                            placeholder="01XXXXXXXXX (optional)"
                                            value={formData.altPhone}
                                            onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block text-gray-900">Note for Delivery</label>
                                    <Input className="bg-white"
                                        placeholder="Special instructions (optional)"
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Summary & Payment */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-sm h-fit">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-lg font-bold text-gray-900">Order Summary</CardTitle>
                                <Button variant="link" size="sm" className="h-auto p-0 text-gray-500" onClick={() => router.push('/cart')}>Modify</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Items */}
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                                    {items.map((item) => (
                                        <div key={item.variantSku} className="flex gap-3">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border bg-gray-100">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="shrink-0">
                                                <p className="text-sm font-medium truncate text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">Size: {item.size} • Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">৳{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 border-t pt-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold text-gray-900">৳{subtotal.toFixed(0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping ({formData.city || 'Select City'})</span>
                                        <span className="font-bold text-gray-900">৳{shipping}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600 font-bold">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span>-৳{appliedCoupon.discountAmount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between border-t pt-4 text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>৳{total.toFixed(0)}</span>
                                </div>

                                {/* Delivery Alert */}
                                <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-xs text-green-700">
                                    <Truck className="h-4 w-4" />
                                    <span>Delivery within 2-3 Days after confirmation</span>
                                </div>

                                {/* Coupon */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter coupon code"
                                            className="bg-white uppercase"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                        <Button
                                            type="button"
                                            variant="default"
                                            className="bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:shadow-md px-6"
                                            onClick={handleApplyCoupon}
                                            disabled={isCouponLoading || !couponCode}
                                        >
                                            {isCouponLoading ? '...' : 'Apply'}
                                        </Button>
                                    </div>
                                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
                                            <span className="text-xs font-bold text-green-700 uppercase">Coupon {appliedCoupon.code} Applied!</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 text-red-500 hover:text-red-700 hover:bg-transparent"
                                                onClick={() => setAppliedCoupon(null)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="font-bold mb-3 text-gray-900">Payment Method</h3>
                                    <div className="space-y-3">
                                        <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50/50' : 'hover:bg-gray-50'}`}>
                                            <div className="flex h-5 items-center">
                                                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-4 w-4 accent-orange-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="h-4 w-4 text-orange-600" />
                                                    <span className="font-semibold">Cash on Delivery</span>
                                                    <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">POPULAR</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Pay when you receive your order</p>
                                            </div>
                                        </label>

                                        <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50/50' : 'hover:bg-gray-50'}`}>
                                            <div className="flex h-5 items-center">
                                                <input type="radio" name="payment" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="h-4 w-4 accent-pink-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-pink-600">bKash</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Pay with bKash mobile wallet</p>
                                            </div>
                                        </label>

                                        {/* bKash Payment Details */}
                                        {paymentMethod === 'bkash' && (
                                            <div className="ml-7 mt-3 space-y-3 rounded-lg border border-pink-200 bg-pink-50/30 p-4">
                                                <div className="rounded-md bg-white p-3 border border-pink-300">
                                                    <p className="text-xs text-gray-600 mb-1">Send money to this number:</p>
                                                    <p className="text-lg font-bold text-pink-600">{BKASH_MERCHANT_NUMBER}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Amount: ৳{total.toFixed(0)}</p>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-1 block text-gray-900">
                                                        Your bKash Number <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        className="bg-white"
                                                        placeholder="01XXXXXXXXX"
                                                        value={bkashSenderNumber}
                                                        onChange={(e) => setBkashSenderNumber(e.target.value)}
                                                        required={paymentMethod === 'bkash'}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-1 block text-gray-900">
                                                        Transaction ID <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        className="bg-white"
                                                        placeholder="Enter bKash transaction ID"
                                                        value={bkashTransactionId}
                                                        onChange={(e) => setBkashTransactionId(e.target.value)}
                                                        required={paymentMethod === 'bkash'}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        You'll receive this after completing the payment
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="flex items-start gap-2">
                                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} />
                                    <label htmlFor="terms" className="text-xs text-gray-600 leading-tight cursor-pointer">
                                        I agree to the <a href="#" className="underline">Terms & Conditions</a>, <a href="#" className="underline">Refund Policy</a> and <a href="#" className="underline">Privacy Policy</a>
                                    </label>
                                </div>

                                {/* Confirm Button */}
                                <Button 
                                    className="w-full bg-black hover:bg-gray-900 h-14 text-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-xl rounded-xl" 
                                    disabled={loading} 
                                    type="submit"
                                >
                                    {loading ? 'Processing...' : `Confirm Order ৳${total.toFixed(0)}`}
                                </Button>

                                {/* Badges */}
                                <div className="flex justify-between text-[10px] text-gray-500 pt-2">
                                    <div className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-green-600" /> Secure Payment</div>
                                    <div className="flex items-center gap-1"><RefreshCw className="h-3 w-3 text-green-600" /> Easy Returns</div>
                                    <div className="flex items-center gap-1"><Truck className="h-3 w-3 text-green-600" /> Fast Delivery</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>

                {/* Mobile Sticky Bar (Optional) */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 text-white lg:hidden z-50 flex items-center justify-between">
                    <span className="font-bold">Total ৳{total.toFixed(0)}</span>
                    <Button 
                        className="bg-white text-black hover:bg-gray-100 font-bold px-8 h-12 rounded-lg transition-all active:scale-95" 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        Confirm Order
                    </Button>
                </div>
            </div>
        </div>
    );
}
