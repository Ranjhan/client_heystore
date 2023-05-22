import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useAuth } from "../context/auth";


const HomePage = () => {


    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    //get all cat
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);
    //get products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    //getTOtal product Count
    const getTotal = async () => {
        try {
            const { data } = await axios.get("http://localhost:8080/api/v1/product/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);
    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // filter by cat
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
    };
    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);

    //get filterd product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post("http://localhost:8080/api/v1/product/product-filters", {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Layout title={"HEY! STORE"}>
            {/* banner image */}
            {/* <img
                src="/images/banner.png"
                className="banner-img"
                alt="bannerimage"
                width={"100%"}
            /> */}
           

            <section id="hero">
                <div className="hero-detail">
                    <h4>Trade-in-offer</h4>
                    <h2>Super value deals</h2>
                    <h1>On all Products</h1>
                    <p>Save more with coupons & up to 70% off! </p>
                    <button
                        onClick={() => {
                            navigate('/categories')
                        }}

                    >Shop Now</button>
                </div>

                <div className="hero-img">
                    <img src="https://www.pngmart.com/files/1/Fashion-Girl-PNG-Pic.png" alt="" />
                </div>
            </section>

            <section id='summers'>
                <div id='summer-appliances'>
                    <p>Best of Electronics</p>
                    <p>➡️</p>
                </div>

                <div id='appliance' >
                    <img src="../../images/Monitors/Samsung32Inch.webp" alt="logo" />
                    <p>Monitors</p>
                    <span>From Rs. 7949</span>
                    <button
                        onClick={() => {
                            navigate('/category/monitors')
                        }}

                    >Shop Now</button>




                </div>

                <div id='appliance'>
                    <img src="../../images/Watchs/e1.png" alt='logo' />
                    <p>Best of Smart Watches</p>
                    <span>From Rs. 1649</span>
                    <button
                        onClick={() => {
                            navigate('/category/smart-watches')
                        }}

                    >Shop Now</button>

                </div>

                <div id='appliance'>
                    <img src="../../images/Mobiles/Iphone11.webp" alt="logo" />
                    <p>Top Mobiles</p>
                    <span>Shop Now!</span>
                    <button
                        onClick={() => {
                            navigate('/category/mobiles')
                        }}

                    >Shop Now</button>
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,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" alt="logo" />
                    <p>Printers</p>
                    <span>From Rs. 3999</span>
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,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" alt="logo" />
                    <p>Premium PowerBank</p>
                    <span>Shop Now</span>
                </div>
            </section>

            <section id='summers'>
                <div id='summer-appliances'>
                    <p>Appliances for a cool Summer</p>
                    <p>➡️</p>
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,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lYVKqGo5dlUqVLsbsw0luLk32yjAeznDUgAAzn8TkEk8bAWm51b4Ti5kK7cZUK7dE6nXzLon4F/V198xeIzCT4bjqY+Rmp1YnGtB5fis900O0eH2m0YjMVx7rt2gHytMbXzVxC7NE9hX7zXqY+U41iSiHf8Ax2wMONx7v9peq5Irptpk9REivRdfeRh1qfO01ylTVXeTcbHPf940qg4Hs+0jCpwPjKxWbj4SolJj6qagWA4KzDwkhMu1R8Tdui3iReQBijwErGKG9fWTUGVTOZ99j1qfQySmc3FQfrt5iYHlEO63Z9o0EO8d/wB44xdtkXLtM7UPYFPjea7lCoru5W40jv4dUtnDDcZHrpoyyaRM0wRYdHmJbrrYqNZNjrvzjxJvtFyL9JEtUW1do8xJr7ZKq1Qp222v0ah1gbjJeGwz1GCILk9wHEyrJ+Ceq4VB1ncJ07N3NxKSi417Sd5M55Z8faNY47RM2M2lpC9ucx0mPFuM3fCU7WlNKiBJVJZwt26L4ns8nsBERAREQPCJQUlyeQLJpiOREvWi0CwaAlBwwkq0QILYQcJafJ6ndMnaeWgYKrkdD8I7pDq5uofgE2nRnmjA0XE5oUm2oO0XmJxOYNI7Ft1XHlOnlBKGoiWWw043icwSPdZu+/mJjMRmfXXYb9a+oM7m+FBllsnqd0szynyzxjgFbIWIXagPUfuBIVTDVF2ow7L+U+gq2SFO6YrFZuI3wjump1MjjHDC1toI7LT0m/TOn5fzJapSdaYAe11J1DSBvYndfZ2zRkzAylp6PJaIv75qIVPSACT3gTU6v0nFhXHOp8NNfMTYcBk56zhVGq+tuH+82PJPszc6JrPexBsurWDfbOh5Jzbp0FAUbIy6ngmPliM3sgpRUc3X68ZsyJJSUAJc0ROLawiS8qyq09gIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIHlp5oyqIFOiOEaI4SqIHlp7EQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERED//Z" alt="logo" />
                    <p>Inveters And Accessories</p>
                    <span>Min. 50% Off</span>
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,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" alt='logo' />
                    <p>Refrigerators</p>
                    <span>Big Saving</span>
                    {/* <button
                        className="btn btn-dark ms-1"
                        onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                                "cart",
                                JSON.stringify([...cart, p])
                            );
                            toast.success("Item Added to cart");
                        }}
                    >
                        ADD TO CART
                    </button> */}
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,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" alt="logo" />
                    <p>Air Coolers</p>
                    <span>Min. 50% Off</span>
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,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" alt="logo" />
                    <p>Water Purifiers</p>
                    <span>Min. 50% Off</span>
                </div>

                <div id='appliance'>
                    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTERITEhAVFRUXFhYVExARGBYRFxAXFRUWFhgSFxUZHSggGBslGxYTIjEhJSkrLi8uFyAzODMtNygtLisBCgoKDg0OGBAQGi0lHx8tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tKy0tLS0tKy0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcDBAUCAQj/xABCEAACAQIEAgUIBwcDBQEAAAAAAQIDEQQFEiExQQYHIlFhEyNxgZGhscEyUmJyssLRFENzgpKi4SQzYzRCk7PwFf/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAdEQEBAQEBAQADAQAAAAAAAAAAARECMSESQVED/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1cxzClQpyq1qkacIq7lJ29Xi/BHjOMtjiKMqU72dneLlFpp3W8Wna64cyns4yCn+3LDyjJQs7x1ynZqF9nK7s2r+s1JqW4l1brVw/7rDVqkeU3opqXoTlq9qNKp1uxT/6CfrqwXyIbnWAWHdoOTXdKzt7iJZhm7jO3k4PZPn4lsNXHT62oPjgqn8tSD+Njr5J1j4SvUjSmp0Jydoqvp0yfcpxk17bFHZVmbmvoRW9tv8kh/wDyITpSqS1OUVdK9kvVaw/FNfoIFd9WVaEKU5TnNyaSUE6lRRjvwhuluuNid4fHQm7Rlv8AVknF+xmbMWVsgAigAAAAAAAAAAAAAAAAAAAAAAAAAAEar4CnPFVJTpxlJNaZNbq9OPB+skpxnG2IqeOl/wBiXyNcpXNzLolha306T/lnOPwZw8T1WZdOV5U6l+G1Wa+ZO2jw0aENwPVnl9P6NKpxvvVm/mdun0YwsIOKoK3dKU5X9rOxFH2pwIjk5Rli1VIwl5OEdKUKSjHezfG3Dc2MXhHFpa27pyhOVtUJRtzXFb+5m1ky/wB1/b+EYnrMvpQ8NUv7bfMb9M+NvDVNUIy70n7UZDDg42pw+6vgZjDQAAAAAAAAAAAAAAAAAAAAAAAAAABysUrYi/fCPucl+h1TnZorTpS+9H22a/Cy8+pWZnlo9swVq6i4p8HffkrK92aGVI+VeB9pyTSad0901zT5njFytFvwAZTtTcnteU3fwTtf3GOXnJenh9mC5+tmng8Q5QhBuMnZNUqbve++qcuX/wBxOxhaGlXbvJ8X8l4Il+DOkADKgAAAAAAAAAAAAAAAAAAAAAAAAAAGhnLShGT4RnF39N4/mN84nTPM44bB1a04tqOjaPFtzil77FnqVv05XireBXnWF0sUKWiEX5xVKcajuuG0nFK99pLfbibOH6wMJOktUpUnJfvKcla/NTtpftZCs/zbDSuoyhKOpaVd3tHVZ3TTV77rvNX4LO6D4y+Fw9JtupGhCe9+1BuUYy1c/o2fNHVzadoNOyvst+LeyRXuR9LsHTtKUoRaiklCWu14xUk4/wAsPHbxd93EdYmFdWlTjGclOpDtaHDhKPBStdegs+pVk0aMYK0YqK7opJe4yAHNpgxGKjBpO93dpJN7K127cOKMM8wS5e+3yPFR3rSf1YxivS7t/GPsM8jUiPEceu72Xl8EZsNiFNNq+zs00009nwfpRjT4mPBO1Sa70pL08H+UWDeABlQAAAAAAAAAAAAAAAAHxsxyxEVxkgMoMUcTB8JIyJ34AfSD9ceKjHLZwckpTlBQjzlpkpP2JE4Ko6+qtqeFj/Gf/rXzZrn1L4g2aK2Dofcp/gRBc0fbXoXxZYGIwMXhKatZ+Thutt9K495DMZjVFrXh6Unb6Vkr28LbGukjxkfH+ZEnziWmthZcLXfscWczIZqo1alTgvspXdtu7Y2OkdNRrUrKy0/CT39458Sv0/hcRGpCNSnJShJKUZLdSTV00ZSOdXVXVlmEf/Hp/plKPyJGc625ifnKr+3Fe6CNmRqr6dT76/KbMmbR9XM18NLzkPGEl74v5GeDNeh/uU/RJe7/AAB0wAYUAAAAAAAAAAAAAAABzs0qdqnHxcnbbhsvj7jzVprvfx+Jjxsv9R4KEfjL/B7ryNxHmlSXe/h8LGTBTtUceUlzd94v9G/YYqUt0eXK1am/tNe2LXzQqOyUz1+Vu3h491OT/qkl+UuYojryrasYod1OEf6nJ/NE59Xpr5grUEu6KXsSIRnSwnY7WI1aN2o0nFTsr7NpuNyd5tC8dPf7kVrnMrSWnhv8Ua6SO3kHk04eSdRrf/dUYvl9Vvnq9xtdK126D8Je5x/U0OisbpPmr+tXOj0sXZovxkval+hZ4lXb1TVtWWUV9WVSP97fzJiV31J174OpH6tS/wDUv8FiHPr1qeOQn26n8RfI2Zs1U/OVP4i+CM9SW5se4S3Nag/OUvTL8Mv0M1OW5r0X52l96X4JEHZABhQAAAAAAAAAAAAAAAHCxU/9TNeEfgesRMjC6QeVxLlTSlTf0pp/QtGyTjx4q3gcXPc+xGtqNZU4pN7UJVtXCyWmD97X6dZGNT2nU3R8rz85T/iQ/FYrfLM5xctFRYqMlqSnSdB0akbvjadPdeKZJMbnjjKnKWlRUlKU32VHS73s9mMNWIfnnrQq682qL/low9lOkmvbcvjDZnCWGjidS8m6Sq6uWnTqv7D84VZvF5hKbk4uU5VnJWbjZ6lZNW46VuZ5i1387q6acnzs0vWVpm/GPr+RYHSDaFvjuQ7M8BBOKqVXGVt4Qh5Rxvw1dqNn4b29OxeiMvRapZx8W17zt9K15mm/tr3xl+hyspwnk3C01OLbcZxur8Lpp7pq628UdrPcLroSlqa0rXp5O3h32uOfC+p71EYi6xcL8qMkv/In+Utg/P3U5myo46EZO0aydJ+l2cPekvWX/OaSbfBK79CM9erHFi/OVvvr5GarJXOHHOoOtWVnx1ppbON0vpcHyOXiellpSUKLlpV352EHa74J7vhyN4mpfTnuYacvPUvvy/DJEVodLFqgp0tLlwSqwm7WvdqPD1nSedxVakrPjqcnwSbkrOXJixNTUHmnNSSkuDSa9D3PRybAAAAAAAAAAAAAA+SvZ248j6APzph8FWw1bExr05UajtPS9rpufajJO0o8rp22fcyI5hmlZuTdTU9TV5xhUdvTKLbLr67stlKnhK8KTk6dXTOcYuWmMrNObS2jePF7drxKd6QR86+yl4KzOm/GcaODzrERfZqON1+7hTp80+MYp8l7CR42FXEU6EI6qtWc46YXcpSemXC5Gej303dX+jxt495Z3VTkcqubSxM6MvJ0oNwq2ah5SUYRSUtlJ6XPbe3sJpjsdMcxrYPJ8DgqkdFWdJQqJNS0woqK0XWzbvC9ttnxID0Np3nWqvuUE/S7v4RL66Y9FaWYUVTqXjKLbp1Fxg3a69DsvYitYdFVg70fKxUruT8teHlOC1RmlpaslxsJ1F/Go10hqdl/B8yO5thn5apUVPykKuqVOdnJR1737KdqkHdWdt2/Ak3SDKcRyoykvrQcKifo0SZCsZhcVGb0UsRHZJ6YVY348bLfiTqz9LJf26mDTpQhCW03NzlDnSTXZUlybTe3co95JYR1QcX/AN0WvarEPyLKsQ21+z1rt6runNX7+01YneCyqql5zRS/izgn/TFuXuLz1IWWoDl1eUJJp2lFpp8LNM/SeV508TlTxLg7yoVNUYq7lKClCWleLiytejvVlDE1ZVZVpeQu5OaWlSbd3GDe7XHd2t4lh1umGW4Kkqcay0UoWUaClVUYxW/ainG+zvvclupmKf6N5zWjQqPyjklNpau1e0Y2348+84+J6aV1JXp0W1vfQ091zeq74vmSbpr0jwmMxFGtgpPybvHErQ6V3u9UrpXb1Le99kQHPaUYy7C2vtffa23E1b8R1cN0yryqReikndK6VRWu7cVNHQ6TZvWlCneo1qbXZSje6W11u/aRXKKWp7rnyVu7uLb6loqeNxepKSpxXk9Su6d5tXV907LjxJL8Fr9H5t4XDtxcW6VO8ZJxcXoWzT3TOgAYaAAAAAAAAAAAAAAAADl5lk+DkpTr4bDyUU5SnVp05WSV225LhY6hyulkNWBxaSvehV2XF+bkBWmN6XYOlJrAZXhYJcK06MIavFU4JNL0u/gjSrdYePfCtGHhCnC39yZEU9r8fiYKuY0ou0p6X3NP5G8ZTeh1i4+PGrCfhOnH8mk72XdPqGJ00cfh4RTdlWjvCLfNp7wXim/G3Eq3DYuFRtU5arcbbWv6bG7LBvS7+hRW7d+CGaurgx3V/Sd3SqOHhLtW9aafvIfm/QnFwnppwr1Y2XnKdSCi34KVVSXrXIuGK2PpyvMrc7sVrlXV1OUYyrVpwuu1Sm9co7vmpOPvZ3KnR/AYCjKvWimoK+qfabb2UYx4OTbSS72cvrB6bSoTeGw0lGrHRKpUdnpu01Tinxumrvkpd/CvMT0qxFepTw+KhDE00pTTqaozi0tLcXGSSaUrXab39Juf5xL3am+Ew+LzmTlUk8PgU7RpQ/eWfDum+9vspqyTabJzlfR3C4dLyVCCf15LXN/zy39XA/P2B6wKtFuFCrWjTi9NKnOpKpZb6YrZW9BIMt638ZTfnsO5rua39T0p+1s1Z/GFwZ3kOErwl+00KcopO9SS0SgrbtVFaUNuaaKwyPq8weNrVmo1lg4tqjJztNy24Nxvotd2ld7xu77R38d0tecfs+FwkZ041GpYnWrOOl38ldfSiktba2d4R5yiWfgMHCjThTpq0YqyXzfe27tvxJ5FQvLuqXLaTuoVZc+3Vn+WxLcqyehhoyjh6MKak9UtCs5v60pcZPxZvAyoAAAAAAAAAAAAAAAAAAAAAhuddXGErNyhqoSe78lbQ2+ehqy/lsQnNeo+pUleGYQta1pUWvhUZdALop/IepadGTc8fF3ttCi+V+bqePcT3JOhmGw8lOzqTW6nVs9L74xSsn47vxJGBpgACChOsignmeK1JPeDtJf8VPdEMzBOmnUhOalFNLtXspNXSb35L2H6R6R9E8NjLOrFqolaNam9M0uOl8VJeDT52sQHOepyc4yVLGxs+CqU3tvzcZb+w3sTFKZbUj5SPY1Ntbzu7Pv2aJ7R1NXlP1RWn43Z1MH1GYmM4yljqNk09oTb+KJ3lXVrRhby1adX7MV5KL8Hu5exoc9YljW6ospjGnVxDXalJ04X5RVpSld8dUnv9wsMxYbDxpwjCEVGMVaMYqyS9BlM27WoAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==" alt="logo" />
                    <p>Mixer Juicer Grinder</p>
                    <span>Min. 50% Off</span>
                </div>
            </section>

            <div className="all-products container-fluid row mt-3 home-page">
                <div className="col-md-3 filters">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c, index) => (
                            <Checkbox
                                key={c._id}
                                onChange={(e) => handleFilter(e.target.checked, c._id)}
                            >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    {/* price filter */}
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p, index) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-danger"
                            onClick={() => window.location.reload()}
                        >
                            RESET FILTERS
                        </button>
                    </div>
                </div>
                <div className="col-md-9 all-products-added ">
                    <h1 className="text-center">All Products</h1>
                    <div className="d-flex flex-wrap">
                        {products?.map((p, index) => (
                            <div className="card m-2" key={p._id}>
                                <img
                                    src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                />
                                <div className="card-body">
                                    <div className="card-name-price">
                                        <h5 className="card-title">{p.name.substring(0, 15)}...</h5>
                                        <h5 className="card-title card-price">
                                            {p.price.toLocaleString("en-IN", {
                                                style: "currency",
                                                currency: "INR",
                                            })}
                                        </h5>
                                    </div>
                                    <p className="card-text ">
                                        {p.description.substring(0, 60)}...
                                    </p>
                                    <div className="card-name-price">
                                        <button
                                            className="btn btn-info ms-1"
                                            onClick={() => navigate(`/product/${p.slug}`)}
                                        >
                                            More Details
                                        </button>
                                        <button
                                            className="btn btn-dark ms-1"
                                            onClick={() => {
                                                setCart([...cart, p]);
                                                localStorage.setItem(
                                                    "cart",
                                                    JSON.stringify([...cart, p])
                                                );
                                                toast.success("Item Added to cart");
                                            }}
                                        >
                                            ADD TO CART
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="m-2 p-3">
                        {products && products.length < total && (
                            <button
                                className="btn loadmore"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page + 1);
                                }}
                            >
                                {loading ? (
                                    "Loading ..."
                                ) : (
                                    <>
                                        {" "}
                                        Loadmore <AiOutlineReload />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>


            <section id="WhatYouCanBuy">
                <h4>What Can You Buy From Desi Shop ?</h4>
                <h6>Mobile Phones</h6>
                <p>From budget phones to state-of-the-art smartphones, we have a mobile for everybody out there. Whether you're looking for larger, fuller screens, power-packed batteries, blazing-fast processors, beautification apps, high-tech selfie cameras or just large internal space, we take care of all the essentials. Shop from top brands in the country like Samsung, Apple, Oppo, Xiaomi, Realme, Vivo, and Honor to name a few. Rest assured, you're buying from only the most reliable names in the market. What's more, with DesiShop's Complete Mobile Protection Plan, you will never again find the need to run around service centres. This plan entails you to a number of post-purchase solutions, starting at as low as Rupees 99 only! Broken screens, liquid damage to phone, hardware and software glitches, and replacements - the DesiShop Complete Mobile Protection covers a comprehensive range of post-purchase problems, with door-to-door services.</p>
                <br />
                <h6>Electronic Devices and Accessories</h6>
                <p>When it comes to laptops, we are not far behind. Filter among dozens of super-fast operating systems, hard disk capacity, RAM, lifestyle, screen size and many other criterias for personalized results in a flash. All you students out there, confused about what laptop to get? Our Back To College Store segregates laptops purpose wise (gaming, browsing and research, project work, entertainment, design, multitasking) with recommendations from top brands and industry experts, facilitating a shopping experience that is quicker and simpler.

                    Photography lovers, you couldn't land at a better page than ours. Cutting-edge DSLR cameras, ever reliable point-and-shoot cameras, millennial favourite instant cameras or action cameras for adventure junkies: our range of cameras is as much for beginners as it is for professionals. Canon, Nikon, GoPro, Sony, and Fujifilm are some big names you'll find in our store. Photography lovers, you couldn't land at a better page than ours. Cutting-edge DSLR cameras, ever reliable point-and-shoot cameras, millennial favourite instant cameras or action cameras for adventure junkies: our range of cameras is as much for beginners as it is for professionals. Canon, Nikon, GoPro, Sony, and Fujifilm are some big names you'll find in our store.

                    Turn your home into a theatre with a stunning surround sound system. Choose from our elaborate range of Sony home theatres, JBL soundbars and Philips tower speakers for an experience to remember.

                    How about jazzing up your phone with our quirky designer cases and covers? Our wide-ranging mobile accessories starting from headphones, power banks, memory cards, mobile chargers, to selfie sticks can prove to be ideal travel companions for you and your phone; never again worry about running out of charge or memory on your next vacation.</p>

                <h6>Large Appliances</h6>
                <p>Sleek TVs, power-saving refrigerators, rapid-cooling ACs, resourceful washing machines - discover everything you need to run a house under one roof. Our Dependable TV and Appliance Store ensures zero transit damage, with a replacement guarantee if anything goes wrong; delivery and installation as per your convenience and a double warranty (Official Brand Warranty along with an extended Flipkart Warranty) - rest assured, value for money is what is promised and delivered. Shop from market leaders in the country like Samsung, LG, Whirlpool, Midea, Mi, Vu, Panasonic, Godrej, Sony, Daikin, and Hitachi among many others.

                    For certain product categories, Customers meeting the eligibility criteria will have the option to buy larger quantities. To know more on the eligibility criteria and terms and conditions, please reach out to Purchases.oni@flipkart.com.
                </p>

                <h6>Small Home Appliances</h6>
                <p>Find handy and practical home appliances designed to make your life simpler: electric kettles, OTGs, microwave ovens, sandwich makers, hand blenders, coffee makers, and many more other time-saving appliances that are truly crafted for a quicker lifestyle. Live life king size with these appliances at home.
                </p>

                <h6>Lifestyle</h6>
                <p>Flipkart, 'India ka Fashion Capital', is your one-stop fashion destination for anything and everything you need to look good. Our exhaustive range of Western and Indian wear, summer and winter clothing, formal and casual footwear, bridal and artificial jewellery, long-lasting make-up, grooming tools and accessories are sure to sweep you off your feet. Shop from crowd favourites like Vero Moda, Forever 21, Only, Arrow, Woodland, Nike, Puma, Revlon, Mac, and Sephora among dozens of other top-of-the-ladder names. From summer staple maxi dresses, no-nonsense cigarette pants, traditional Bandhani kurtis to street-smart biker jackets, you can rely on us for a wardrobe that is up to date. Explore our in-house brands like Metronaut, Anmi, and Denizen, to name a few, for carefully curated designs that are the talk of the town. Get ready to be spoiled for choice.Festivals, office get-togethers, weddings, brunches, or nightwear - Flipkart will have your back each time.</p>


                <h6>Home and Furniture</h6>
                <p>Moving to a new place is never easy, especially if you're buying new furniture. Beds, sofa sets, dining tables, wardrobes, and TV units - it's not easy to set up everything again. With the hundreds of options thrown at you, the ride could be overwhelming. What place is reliable, what furniture will stand the test of time? These are questions you must ask before you choose a store. Well, our Durability Certified Furniture Store has not only curated a range of furniture keeping in mind the modern Indian consumer but furniture that comes with a lab certification, ensuring they last you for up to 10 years. Yes, all our furniture has gone through 35 stability and load tests so that you receive only the best-quality furniture. Be FurniSure, always. Names to look out for are Nilkamal, Godrej Interio, Urban Ladder, HomeTown, Durian and Perfect Homes.

                    You may have your furniture all set up, but they could end up looking flat and incomplete without complementary decor. Curtains, cushion covers, bed sheets, wall shelves, paintings, floor lamps - find everything that turns a house to an inviting home under one roof at Flipkart.
                </p>

                <h6>Baby and Kids</h6>
                <p>Your kids deserve only the best. From bodysuits, booties, diapers to strollers, if you're an expecting mother or a new mother, you will find everything you need to set sail on a smooth parenting journey with the help of our baby care collection. When it comes to safety, hygiene and comfort, you can rely on us without a second thought. Huggies, Pampers, MamyPoko, and Johnson & Johnson: we host only the most-trusted names in the business for your baby.
                </p>

                <h6>Books, Sports and Games</h6>
                <p>Work hard and no play? We don't believe in that. Get access to best-selling fiction and non-fiction books by your favourite authors, thrilling English and Indian blockbusters, most-wanted gaming consoles, and a tempting range of fitness and sports gadgets and equipment bound to inspire you to get moving.
                </p>

                <h6>Grocery/Supermart</h6>
                <p>Launching into the grocery vertical, Flipkart introduces Supermart that is out to bring everyday essentials close to you. From pulses, spices, dairy, personal and sanitary care, breakfast essentials, health drinks, spreads, ready to cook, grooming to cleaning agents, we are happy to present everything you need to run a house. Now buy Grocery products for as low as 1 Rupee only - our 1 Rupee Store presents new products every day for a nominal price of 1 Rupee only. Terms and conditions apply.</p>
            </section>
        </Layout >
    );
};

export default HomePage;
