import { CreditCard, HeadphonesIcon, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Local } from "sode-extend-react";
import CulqiRest from "./Actions/CulqiRest";
import Global from "./Utils/Global";
import Number2Currency from "./Utils/Number2Currency";
import CouponsRest from "./Actions/CouponsRest";
import Tippy from "@tippyjs/react";
import { CarritoProvider } from "./context/CarritoContext";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Header from "./components/Tailwind/Header";

const places = {
    metropolitana: {
        name: "Lima Metropolitana",
        delivery: "Gratis",
        items: [
            "Ate",
            "Barranco",
            "Breña",
            "Cercado de Lima",
            "Chorrillos",
            "Comas",
            "El Agustino",
            "Independencia",
            "Jesús María",
            "La Molina",
            "La Victoria",
            "Lince",
            "Los Olivos",
            "Magdalena del Mar",
            "Miraflores",
            "Pueblo Libre",
            "Rímac",
            "San Borja",
            "San Isidro",
            "San Juan de Lurigancho",
            "San Juan de Miraflores",
            "San Luis",
            "San Martin de Porres",
            "San Miguel",
            "Santa Anita",
            "Santiago de Surco",
            "Surquillo",
            "Villa el Salvador",
            "Villa Maria del Triunfo",
        ],
    },
    alrededores: {
        name: "Lima Alrededores",
        delivery: "Por Shalom - Pago en destino",
        items: [
            "Ancón",
            "Carabayllo",
            "Chaclacayo",
            "Cieneguilla",
            "Lurín",
            "Pachacámac",
            "Pucusana",
            "Puente Piedra",
            "Punta Hermosa",
            "Punta Negra",
            "San Bartolo",
            "Lurigancho (Chosica)",
            "Santa María del Mar",
            "Santa Rosa",
        ],
    },
    provincias: {
        name: "Provincias",
        delivery: "Por Shalom - Pago en destino",
        items: "",
    },
};

const couponRest = new CouponsRest();

const Checkout = ({ publicKey, session }) => {
    const couponRef = useRef(null);

    Culqi.publicKey = publicKey;
    Culqi.options({
        paymentMethods: {
            tarjeta: true,
            yape: true,
            billetera: false,
            bancaMovil: false,
            agente: false,
            cuotealo: false,
        },
        installments: true,
        style: {
            logo: `${location.origin}/assets/img/icon-purple.svg`,
            bannerColor: "#A191B8",
        },
    });

    const cart = (() => {
        try {
            const savedCart = localStorage.getItem("carrito");
            if (!savedCart) return [];
            
            // Verificar si los datos parecen ser JSON válido
            if (savedCart.startsWith("U2FsdGVkX1")) {
                // Los datos están encriptados, limpiar localStorage y retornar array vacío
                localStorage.removeItem("carrito");
                return [];
            }
            
            return JSON.parse(savedCart);
        } catch (error) {
            // Si hay error al parsear, limpiar localStorage y retornar array vacío
            console.warn("Error parsing cart data, clearing localStorage:", error);
            localStorage.removeItem("carrito");
            return [];
        }
    })();
    console.log(cart);
    const [sale, setSale] = useState({
        name: session?.name || null,
        lastname: session?.lastname || null,
        email: "basiliohinostroza2003bradneve@gmail.com",
        phone: session?.phone || null,
        country: "Perú",
        department:
            Object.keys(places).find(
                (x) => places[x].name == session?.department
            ) || null,
        province: session?.province || null,
        district: session?.district || null,
        zip_code: session?.zip_code || null,
        address: session?.address || null,
        number: session?.address_number || null,
        reference: session?.address_reference || null,
        comment: null,
    });
    const [loading, isLoading] = useState(false);
    const [coupon, setCoupon] = useState(null);

    const totalPrice = cart.reduce((acc, item) => {
        if (item.variations && item.variations.length > 0) {
            return (
                acc +
                item.variations.reduce(
                    (sum, v) => sum + item.final_price * v.quantity,
                    0
                )
            );
        }
        return acc + item.final_price * item.quantity;
    }, 0);

    const planDiscount = totalPrice * 0;

    const couponDiscount =
        ((totalPrice - planDiscount) * (coupon?.amount || 0)) / 100;

    const getSale = () => {
        let department = "Lima";
        let province = "Lima";
        let district = null;

        if (Array.isArray(places[sale.department].items)) {
            department = places[sale.department].name;
            province = sale.province;
            district = null;
        } else {
            department = sale.province;
            province = null;
            district = sale.district;
        }

        return {
            ...sale,
            department,
            province,
            district,
        };
    };

    const onCulqiOpen = async (e) => {
        e.preventDefault();
        console.log(cart);
        if (loading) return;
        isLoading(true);
        let order_number = null;
        if (totalPrice > 0) {
            const resCQ = await CulqiRest.order(
                {
                    ...getSale(),
                    order_number: Culqi.order_number,
                    renewal_id: "000001",
                    coupon: coupon?.name ?? null,
                },
                cart
            );
            if (resCQ) {
                order_number = resCQ.data.id;
                Culqi.order_number = resCQ.data.order_number;
            }
        }
        isLoading(false);
        Culqi.settings({
            title: "(Suscripción)",
            currency: "PEN",
            amount: Math.ceil(
                (totalPrice - planDiscount - couponDiscount) * 100
            ),
            order: order_number,
        });
        Culqi.open();
    };

    window.culqi = async () => {
        if (Culqi.token) {
            const resCQ = await CulqiRest.token({
                order: Culqi.order_number,
                token: Culqi.token,
            });
            if (resCQ) location.href = "/thanks";
        } else if (Culqi.order) {
            redirectOnClose();
            const order_number = Culqi.order_number.replace(
                `#${Global.APP_CORRELATIVE}-`,
                ""
            );
            fetch(`/api/sales/notify/${order_number}`);
        }
    };

    const redirectOnClose = () => {
        setInterval(() => {
            if (Culqi.isOpen) return;
            // const order_number = Culqi.order_number.replace(`#${Global.APP_CORRELATIVE}-`, '')
            // fetch(`/api/sales/notify/${order_number}`)
            // .then(res => {
            location.href = `/`;
            // })
        }, 500);
    };

    const onCouponApply = (e) => {
        e.preventDefault();
        const coupon = (couponRef.current.value || "").trim().toUpperCase();
        if (!coupon) return;
        couponRest
            .save({
                coupon,
                amount: totalPrice,
                email: "basiliohinostroza2003bradneve@gmail.com",
            })
            .then((result) => {
                if (result) setCoupon(result.data);
                else setCoupon(null);
            });
    };

    const onCouponKeyDown = (e) => {
        if (e.key == "Enter") onCouponApply(e);
    };

    return (
        <>
            <Header showSlogan={true} backgroundHeight="h-0" />
            <section className="px-[5%] md:px-[7.5%] lg:px-[10%] pb-[5%] mt-[7.5%] md:mt-[5%] lg:mt-[2.5%] text-[#404040] bg-[#EFE5FF]">
                <div className="max-w-4xl mx-auto">
                    <div className="py-6 flex justify-center space-x-8 text-sm text-gray-600">
                        <div className="flex items-center">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>SSL Pago Seguro</span>
                        </div>
                        <div className="flex items-center">
                            <HeadphonesIcon className="mr-2 h-4 w-4" />
                            <span>24/7 Atención al cliente</span>
                        </div>
                        <div className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Pago online</span>
                        </div>
                    </div>
                    <form
                        className="w-full rounded-lg bg-white p-8 shadow-lg"
                        onSubmit={onCulqiOpen}
                        disabled={loading}
                    >
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 relative">
                            <div className="lg:col-span-3">
                                <h2 className="mb-4 text-xl font-semibold">
                                    INFORMACIÓN PERSONAL
                                </h2>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium "
                                            htmlFor="firstName"
                                        >
                                            Nombre{" "}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                            value={sale.name}
                                            onChange={(e) =>
                                                setSale((old) => ({
                                                    ...old,
                                                    name: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="mb-1 block text-sm font-medium "
                                            htmlFor="lastName"
                                        >
                                            Apellidos{" "}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                            value={sale.lastname}
                                            onChange={(e) =>
                                                setSale((old) => ({
                                                    ...old,
                                                    lastname: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label
                                        className="mb-1 block text-sm font-medium "
                                        htmlFor="country"
                                    >
                                        País / Región{" "}
                                        <b className="text-red-500">*</b>
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                        value={sale.country}
                                        disabled
                                        required
                                    />
                                </div>
                                <div className="mt-4 grid gap-4 md:grid-cols-5">
                                    <div className="md:col-span-3">
                                        <label
                                            className="mb-1 block text-sm font-medium "
                                            htmlFor="department"
                                        >
                                            Región / Provincia{" "}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <select
                                            id="department"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                            value={sale.department}
                                            onChange={(e) =>
                                                setSale((old) => ({
                                                    ...old,
                                                    department: e.target.value,
                                                }))
                                            }
                                            required
                                        >
                                            <option value="">
                                                Elige una opción
                                            </option>
                                            {Object.keys(places).map(
                                                (key, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={key}
                                                        >
                                                            {places[key].name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>
                                </div>
                                {places[sale.department] && (
                                    <div className="mt-4 grid gap-4 md:grid-cols-5">
                                        {Array.isArray(
                                            places[sale.department].items
                                        ) ? (
                                            <>
                                                <div className="md:col-span-3">
                                                    <label
                                                        className="mb-1 block text-sm font-medium "
                                                        htmlFor="district"
                                                    >
                                                        Provincia{" "}
                                                        <b className="text-red-500">
                                                            *
                                                        </b>
                                                    </label>
                                                    <select
                                                        id="province"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                                        value={sale.province}
                                                        onChange={(e) =>
                                                            setSale((old) => ({
                                                                ...old,
                                                                province:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Elige una opción
                                                        </option>
                                                        {places[
                                                            sale.department
                                                        ].items.map(
                                                            (
                                                                province,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <option
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            province
                                                                        }
                                                                    >
                                                                        {
                                                                            province
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label
                                                        className="mb-1 block text-sm font-medium  truncate text-ellipsis"
                                                        htmlFor="postalCode"
                                                        title="Código postal"
                                                    >
                                                        Código postal
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="postalCode"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                                        value={sale.zip_code}
                                                        onChange={(e) =>
                                                            setSale((old) => ({
                                                                ...old,
                                                                zip_code:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="md:col-span-2">
                                                    <label
                                                        className="mb-1 block text-sm font-medium  truncate text-ellipsis"
                                                        htmlFor="postalCode"
                                                        title="Código postal"
                                                    >
                                                        Departamento{" "}
                                                        <b className="text-red-500">
                                                            *
                                                        </b>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="postalCode"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                                        value={sale.province}
                                                        onChange={(e) =>
                                                            setSale((old) => ({
                                                                ...old,
                                                                province:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label
                                                        className="mb-1 block text-sm font-medium  truncate text-ellipsis"
                                                        htmlFor="postalCode"
                                                        title="Código postal"
                                                    >
                                                        Distrito{" "}
                                                        <b className="text-red-500">
                                                            *
                                                        </b>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="postalCode"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                                        value={sale.district}
                                                        onChange={(e) =>
                                                            setSale((old) => ({
                                                                ...old,
                                                                district:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="mb-1 block text-sm font-medium  truncate text-ellipsis"
                                                        htmlFor="postalCode"
                                                        title="Código postal"
                                                    >
                                                        Código postal
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="postalCode"
                                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                                        value={sale.zip_code}
                                                        onChange={(e) =>
                                                            setSale((old) => ({
                                                                ...old,
                                                                zip_code:
                                                                    e.target
                                                                        .value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <div className="">
                                        <label
                                            className="mb-1 block text-sm font-medium "
                                            htmlFor="address"
                                        >
                                            Dirección completa{" "}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                            value={sale.address}
                                            placeholder="Nombre de la calle y número de la calle"
                                            onChange={(e) =>
                                                setSale((old) => ({
                                                    ...old,
                                                    address: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="md:col-span-2 lg:col-span-1">
                                        <label
                                            className="mb-1 block text-sm font-medium "
                                            htmlFor="number"
                                        >
                                            Número{" "}
                                            <b className="text-red-500">*</b>
                                        </label>
                                        <input
                                            type="text"
                                            id="number"
                                            className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                            value={sale.number}
                                            placeholder="Nombre de la calle y número de la calle"
                                            onChange={(e) =>
                                                setSale((old) => ({
                                                    ...old,
                                                    number: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label
                                        className="mb-1 block text-sm font-medium "
                                        htmlFor="apartment"
                                    >
                                        Apartamento, habitación, piso, etc.
                                        (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        id="apartment"
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                        value={sale.reference}
                                        onChange={(e) =>
                                            setSale((old) => ({
                                                ...old,
                                                reference: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="mb-1 block text-sm font-medium "
                                        htmlFor="email"
                                    >
                                        Dirección de correo electrónico{" "}
                                        <b className="text-red-500">*</b>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm outline-none"
                                        value={sale.email}
                                        placeholder="Dirección de correo electrónico"
                                        onChange={(e) =>
                                            setSale((old) => ({
                                                ...old,
                                                email: e.target.value,
                                            }))
                                        }
                                        required
                                        disabled
                                    />
                                </div>
                                <div className="mt-4">
                                    <label
                                        className="mb-1 block text-sm font-medium "
                                        htmlFor="phone"
                                    >
                                        Teléfono/Celular{" "}
                                        <b className="text-red-500">*</b>
                                    </label>
                                    <div className="flex border rounded-md border-gray-300">
                                        <span className="py-2 px-3 border-e">
                                            +51
                                        </span>
                                        <input
                                            type="tel"
                                            id="phone"
                                            className="w-full p-2 text-sm outline-none"
                                            value={sale.phone}
                                            onChange={(e) =>
                                                setSale((old) => ({
                                                    ...old,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            placeholder="900000000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="mb-4 text-xl font-semibold">
                                        Pago
                                    </h3>
                                    <div className="rounded-md border border-gray-300">
                                        <div className="p-4 py-3 flex justify-between">
                                            <img
                                                className="h-4"
                                                src="/assets/img/checkout/culqi-logo.svg"
                                                alt="Culqi"
                                            />
                                            <div className="flex gap-2">
                                                <img
                                                    className="h-4"
                                                    src="/assets/img/checkout/cards.svg"
                                                    alt="Cards"
                                                />
                                                <img
                                                    className="h-4"
                                                    src="/assets/img/checkout/pagoefectivo.svg"
                                                    alt="Pago efectivo"
                                                />
                                                <img
                                                    className="h-4"
                                                    src="/assets/img/checkout/yape.svg"
                                                    alt="Yape"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs bg-[#f9f9f9] p-4 px-6 rounded-b">
                                            Acepta pagos con{" "}
                                            <b>
                                                tarjetas de débito y crédito,
                                                Yape, Cuotealo BCP y
                                                PagoEfectivo
                                            </b>
                                            (billeteras móviles, agentes y
                                            bodegas).
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 text-xs">
                                    <p className="text-justify">
                                        Sus datos personales se utilizarán para
                                        procesar su pedido, respaldar su
                                        experiencia en este sitio web y para
                                        otros fines descritos en nuestra{" "}
                                        <a
                                            href="#"
                                            className="text-purple-600 hover:underline"
                                        >
                                            política de privacidad
                                        </a>
                                        .
                                    </p>
                                </div>
                                {/* <button className="mt-6 w-full rounded-md bg-pink-400 py-3 text-white hover:bg-pink-500" onClick={onCulqiOpen}>
                  <i className='mdi mdi-lock me-1'></i>
                  Realizar el pedido S/ {Number2Currency(totalPrice)}
                </button> */}
                            </div>
                            <div className="lg:col-span-2 relative">
                                <div className="block sticky top-4">
                                    <h2 className="mb-4 text-xl font-semibold">
                                        Tu pedido
                                    </h2>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <div className="mb-4 flex justify-between border-b pb-2 font-bold">
                                            <span className="">Producto</span>
                                            <span className="">Subtotal</span>
                                        </div>
                                        <div className="mb-2">
                                            {cart.map((item, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="mb-1 flex items-center justify-between text-sm"
                                                    >
                                                        <div className="flex gap-2">
                                                            <div className="h-10 aspect-[3/4] relative">
                                                                <img
                                                                    className="h-10 aspect-[3/4] object-contain object-center rounded-md border"
                                                                    src={`/api/items/media/${item.image}`}
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    onError={(
                                                                        e
                                                                    ) =>
                                                                        (e.target.src =
                                                                            "/api/cover/thumbnail/null")
                                                                    }
                                                                />
                                                            </div>
                                                            <div>
                                                                <p>
                                                                    {item.name}
                                                                </p>
                                                                <small className="text-xs text-gray-500">
                                                                    <span className="w-6 inline-block text-nowrap">
                                                                        ×{" "}
                                                                        {item.variations &&
                                                                        item
                                                                            .variations
                                                                            .length >
                                                                            0
                                                                            ? item.variations.reduce(
                                                                                  (
                                                                                      sum,
                                                                                      v
                                                                                  ) =>
                                                                                      sum +
                                                                                      v.quantity,
                                                                                  0
                                                                              )
                                                                            : item.quantity}
                                                                    </span>
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <span className="">
                                                            S/{" "}
                                                            {Number2Currency(
                                                                item.variations &&
                                                                    item
                                                                        .variations
                                                                        .length >
                                                                        0
                                                                    ? item.variations.reduce(
                                                                          (
                                                                              sum,
                                                                              v
                                                                          ) =>
                                                                              sum +
                                                                              item.final_price *
                                                                                  v.quantity,
                                                                          0
                                                                      )
                                                                    : item.final_price *
                                                                          item.quantity
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mb-2 mt-4 flex justify-between border-b pb-2 text-sm font-bold">
                                            <span>Subtotal</span>
                                            <span>
                                                S/ {Number2Currency(totalPrice)}
                                            </span>
                                        </div>

                                        {coupon && (
                                            <div className="mb-2 mt-2 flex justify-between items-center border-b pb-2 text-sm font-bold">
                                                <span>
                                                    Cupón aplicado{" "}
                                                    <Tippy content="Eliminar">
                                                        <i
                                                            className="mdi mdi-close text-red-500 cursor-pointer"
                                                            onClick={() =>
                                                                setCoupon(null)
                                                            }
                                                        ></i>
                                                    </Tippy>
                                                    <small className="block text-xs font-light">
                                                        {coupon.name}{" "}
                                                        <Tippy
                                                            content={
                                                                coupon.description
                                                            }
                                                        >
                                                            <i className="mdi mdi-information-outline ms-1"></i>
                                                        </Tippy>{" "}
                                                        (-
                                                        {Math.round(
                                                            coupon.amount * 100
                                                        ) / 100}
                                                        %)
                                                    </small>
                                                </span>
                                                <span>
                                                    S/ -
                                                    {Number2Currency(
                                                        couponDiscount
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {sale.department && (
                                            <div className="mb-4 flex justify-between text-sm border-b pb-2">
                                                <span className="font-bold">
                                                    Envío
                                                </span>
                                                <span>
                                                    {
                                                        places?.[
                                                            sale.department
                                                        ]?.delivery
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg font-semibold">
                                            <span>Total</span>
                                            <span>
                                                S/{" "}
                                                {Number2Currency(
                                                    totalPrice -
                                                        planDiscount -
                                                        couponDiscount
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    {!coupon && (
                                        <div className="mt-6 flex">
                                            <input
                                                ref={couponRef}
                                                type="text"
                                                placeholder="Código de cupón"
                                                className="w-full rounded-l-md border border-gray-300 p-2 px-4 text-sm outline-none uppercase focus:border-[#C5B8D4]"
                                                value={coupon?.name}
                                                onKeyDown={onCouponKeyDown}
                                                disabled={loading}
                                            />
                                            <button
                                                className="rounded-r-md bg-[#5339B1] px-4 py-2 text-sm text-white"
                                                type="button"
                                                onClick={onCouponApply}
                                                disabled={loading}
                                            >
                                                Aplicar
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        className="mt-6 w-full rounded-md bg-[#FF9900] py-3 text-white disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        <i className="mdi mdi-lock me-1"></i>
                                        Pagar Ahora
                                        <small className="ms-1">
                                            (S/{" "}
                                            {Number2Currency(
                                                totalPrice -
                                                    planDiscount -
                                                    couponDiscount
                                            )}
                                            )
                                        </small>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Checkout {...properties} />
            </Base>
        </CarritoProvider>
    );
});
