# Activity

Frontend (Send data) ⟹ Backend (Receive Data, Create pdf from HTML)

Frontend (Request) ⟸ Backend (Send file)

# Package

- Frontend

`file-saver` dùng để `saveAs` (lưu file pdf)

```
npm i file-saver
```

```tsx
import { saveAs } from "file-saver"
...
...
...
saveAs(pdfBlob, "newPdf.pdf")
```

- Backend

`html-pdf` dùng để tạo file pdf từ html

```
npm i html-pdf
```

```js
pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", (err) => {
    if(err) {
        res.send(Promise.reject());
    }
    res.send(Promise.resolve());
})
```

# Use

- Frontend

```tsx
const createAndDownloadPdf = () => {
    axios.post("/create-pdf", state)
      .then(() => axios.get("fetch-pdf", { responseType: "blob" })) // blob - Binary Large Object
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "newPdf.pdf");
      })
  }
```

**Attention:** blod (Binary Large Object) - một đối tượng chứa dữ liệu nhị phân thô. Được sử dụng với các loại dữ liệu như hình ảnh, tệp PDF, video, hoặc bất kỳ nội dung nào không phải là văn bản thuần túy

- Backend

```js
// Post - PDF generation and fetching of data
app.post("/create-pdf", (req, res) => {
    pdf.create(pdfTemplate(req.body), {}).toFile("result.pdf", (err) => {
        if(err) {
            res.send(Promise.reject());
        }
        res.send(Promise.resolve());
    })
})

// Get - Send the generated PDF to the client
app.get("/fetch-pdf", (_, res) => {
    res.sendFile(path.join(__dirname, "result.pdf"));
})
```
