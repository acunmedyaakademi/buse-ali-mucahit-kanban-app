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

// Eğer sayfa bulunamazsa yönlendirme yap
export function getPage(url) {
  const exactPage = routes.find((x) => x.url === url);
  return exactPage || { title: "Not Found", component: <NotFound /> };
}

function NotFound() {
  return <h1>Bu sayfa bulunamadı.</h1>;
}
