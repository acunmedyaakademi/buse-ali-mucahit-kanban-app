import Board from "./components/Board";
import NewEditBoard from "./components/NewEditBoard";
import NewEditTask from "./components/NewEditTask";
import TodoDetail from "./components/TodoDetail";

const routes = [
  { title: "Home", url: "/", component: <Board /> },
  { title: "NewEditBoard", url: "/new-edit-board", component: <NewEditBoard /> },
  { title: "NewEditTask", url: "/new-edit-task", component: <NewEditTask /> },
  { url: "/todo-detail", component: <TodoDetail /> },   
];

const notFound = {
  component: <NotFound />,
};

export function getPage(url) {
  const exactPage = routes.find((x) => x.url === url);
  if (exactPage) return exactPage;

  // if (url.startsWith("/feedback-detail/")) {
  //   return { title: "Feedback Detail", component: <FeedbackDetail /> };
  // }

  // if (url.startsWith("/tags/")) {
  //   return { title: "Tagged Notes", component: <TaggedNotes /> };
  // }

  return notFound;
}

function NotFound() {
  return <h1>Bu sayfa bulunamadı.</h1>;
}
