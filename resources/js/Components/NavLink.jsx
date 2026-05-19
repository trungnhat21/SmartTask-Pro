import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-white text-black focus:border-indigo-400'
                    : 'border-transparent text-black hover:text-orange-500 hover:border-slate-700 focus:text-slate-100 focus:border-slate-700') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}