import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Thông tin hồ sơ
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Cập nhật thông tin hồ sơ tài khoản và địa chỉ email của bạn.
                </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center justify-between">
                <form onSubmit={submit} className="mt-6 space-y-6 max-w-md" noValidate>
                    <div>
                        <InputLabel htmlFor="name" value="Họ tên" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            //required
                            autoComplete="username"
                        />

                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Lưu</PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">
                                Đã lưu
                            </p>
                        </Transition>
                    </div>
                </form>
                <div className="hidden md:flex justify-end items-center w-full pr-10 -mt-16">
                    <i className="fa fa-users text-[180px] text-blue-500 opacity-100" aria-hidden="true"></i>
                </div>
            </div>
        </section>
    );
}
