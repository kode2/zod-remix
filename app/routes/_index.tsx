import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { useForm } from 'react-hook-form'

import styles from "~/styles/index.css";
import { zodResolver } from "@hookform/resolvers/zod";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Remix with ZOD" },
    { name: "description", content: "Welcome to Remix and ZOD!" },
  ];
};

export default function Index() {

  const schema = z.object({
    firstName: z.string().min(2).max(30),
    lastName: z.string().min(2).max(30),
    email: z.string().email(),
    age: z.number().min(18).max(70),
    password: z.string().min(5).max(20),
    confirmPassword: z.string().min(5).max(20),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const submitData = (data: FormData) => {
    console.log("It worked!", data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitData)} className="form-container">
        <label>First name:</label>
        <input type="text" {...register("firstName")} />
        {errors.firstName && <span>{errors.firstName.message}</span>}
        <label>Last name:</label>
        <input type="text" {...register("lastName")} />
        {errors.lastName && <span>{errors.lastName.message}</span>}
        <label>Email:</label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
        <label>Age:</label>
        <input type="number" {...register("age", { valueAsNumber: true })} />
        {errors.age && <span>{errors.age.message}</span>}
        <label>Password:</label>
        <input type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
        <label>Confirm Password:</label>
        <input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
