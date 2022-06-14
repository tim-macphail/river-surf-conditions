import HomePage from "./HomePage";
import UploadPage from "./UploadPage";
import Tens from "./Tens";
import PhotosPage from "./PhotosPage";

const pages = [
    { path: "/", component: <HomePage /> },
    { path: "/upload", component: <UploadPage /> },
    { path: "/tens", component: <Tens /> },
    { path: "/photos", component: <PhotosPage /> }
];

module.exports = {
    pages
}