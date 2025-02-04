# React form validators with YUP

<div align="center">
    <image src="./image.png" height="400px" >
</div>

## Setup

```
npm install yup
```

Tham khảo thêm tại đây https://www.npmjs.com/package/yup

## Việc sử dụng YUP và không sử dụng trong việc validate form

**1. Không sử dụng YUP**

Code đầy đủ [tại đây](./src/components/FormWithoutYup.jsx)

```jsx
const [errors, setErrors] = useState();

const isValidEmail = (email) => {...};

const isValidPhoneNumber = (phoneNumber) => {...};

const isValidPassword = (password) => {...};

const isValidAge = (age) => {...}

const validateForm = () => {
  let newErrors = {};

  if (!formData.firstName) {
    newErrors.firstName = "First name is required";
  }
  if (!formData.lastName) {
    newErrors.lastName = "Last name is required";
  }
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    newErrors.email = "Invalid email format";
  }
  if (!formData.phoneNumber) {
    newErrors.phoneNumber = "Phone number is required";
  } else if (!isValidPhoneNumber(formData.phoneNumber)) {
    newErrors.phoneNumber = "Phone number must be 10 digits";
  }
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (!isValidPassword(formData.password)) {
    newErrors.password =
      "Password must be at least 8 characters long and contain at least one symbol, one number, one uppercase letter, and one lowercase letter";
  }
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Confirm password is required";
  } else if (formData.confirmPassword !== formData.password) {
    newErrors.confirmPassword = "Passwords must match";
  }
  if (!formData.age) {
    newErrors.age = "Age is required";
  } else if (!isValidAge(formData.age)) {
    newErrors.age =
      "You must be at least 18 years old and not older than 100 years";
  }
  if (!formData.gender) {
    newErrors.gender = "Gender is required";
  }
  if (formData.interests.length === 0) {
    newErrors.interests = "Select at least one interest";
  }
  if (!formData.birthDate) {
    newErrors.birthDate = "Date of birth is required";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
```

như chúng ta thấy code rất dài và khó kiểm soát cho các trường hợp

**2. Việc sử dụng YUP**

Code đầy đủ [tại đây](./src/components/FormWithYup.jsx)

Yup cho phép bạn định nghĩa một **schema validation** để kiểm tra giá trị của các input. Bạn có thể kiểm tra kiểu dữ liệu, giá trị tối thiểu, tối đa, độ dài chuỗi, và nhiều điều kiện khác.

```jsx
const [errors, setErrors] = useState({});

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  email: Yup.string()
    .required("Email is Required")
    .email("Invalid email format"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be 10 digits")
    .required(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one symbol"
    )
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .min(18, "You must be at least 18 years old")
    .max(100, "You cannot be older than 100 years")
    .required("Age is required"),
  gender: Yup.string().required("Gender is required"),
  interests: Yup.array()
    .min(1, "Select at least one interest")
    .required("Select at least one interest"),
  birthDate: Yup.date().required("Date of birth is required"),
});
```

Sau khi định nghĩa schema, bạn có thể sử dụng phương thức `validate` hoặc `validateSync` để kiểm tra dữ liệu.

_Chú ý_: Trong Yup, `cast()` được sử dụng để **chuyển đổi dữ liệu (data transformation)** theo schema đã định nghĩa. Nó giúp đảm bảo dữ liệu đầu vào đúng với kiểu dữ liệu mong muốn trước khi tiến hành kiểm tra tính hợp lệ (`validate()`).

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  const nonParsed = {
    firstName: "Piyush",
    lastName: "Agarwal",
    email: "piyush@example.com",
    phoneNumber: "1231234218",
    password: "123456Qq*",
    confirmPassword: "123456Qq*",
    age: "18",
    gender: "male",
    interests: ["coding"],
    birthDate: "2024-02-12",
  };

  const parsedUser = validationSchema.cast(nonParsed);

  console.log(nonParsed, parsedUser);

  try {
    await validationSchema.validate(formData, { abortEarly: false });
    console.log("Form Submitted", formData);
  } catch (error) {
    const newErrors = {};

    error.inner.forEach((err) => {
      newErrors[err.path] = err.message;
    });

    setErrors(newErrors);
  }
};
```

Cách `cast()` hoạt động:

```jsx
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  age: Yup.number().required(),
  birthDate: Yup.date().required(),
  isSubscribed: Yup.boolean(),
});

const rawData = {
  age: "18", // Chuỗi thay vì số
  birthDate: "2024-02-12", // Chuỗi thay vì Date object
  isSubscribed: "true", // Chuỗi thay vì boolean
};

const transformedData = validationSchema.cast(rawData);

console.log(transformedData);
/*
Output:
{
  age: 18,  // Đã chuyển từ string -> number
  birthDate: Mon Feb 12 2024 ...,  // Đã chuyển từ string -> Date
  isSubscribed: true  // Đã chuyển từ string -> boolean
}
*/
```

Khi nào nên dùng `cast()`?

- Khi bạn nhận dữ liệu từ **form** nhưng cần **chuyển đổi** trước khi kiểm tra.
- Khi bạn muốn **chuẩn hóa** dữ liệu trước khi gửi lên API.
- Khi bạn có một schema phức tạp với các kiểu dữ liệu cần chuyển đổi (**string -> number, string -> boolean**, v.v.).
