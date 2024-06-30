import { ReactNode, createContext, useContext, useReducer } from "react";

enum FileActionType {
  SET_FILE = "SET_FILE",
  SET_FILE_LIST = "SET_FILE_LIST",
  SET_LOADING = "SET_LOADING",
  SET_ERRORS = "SET_ERRORS",
}

type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};

type FileContextState = {
  isLoading: boolean;
  file: File | null;
  fileList: File[];
  errors?: string[];
};

type FileAction = ReducerAction<
  FileActionType,
  Partial<FileContextState>
>;

type FileDispatch = ({ type, payload }: FileAction) => void;

type FileContextType = {
  state: FileContextState;
  dispatch: FileDispatch;
};

type FileProviderProps = { children: ReactNode };

const FileContextInitialValues: Partial<FileContextState> = {
  file: null,
  isLoading: false,
  fileList: [],
  errors: [],
};

const FileContext = createContext({} as FileContextType);

const FileReducer = (state: FileContextState, action: FileAction): FileContextState => {
  switch (action.type) {
    case FileActionType.SET_FILE:
      return { ...state, file: action.payload?.file || null };
    case FileActionType.SET_FILE_LIST:
      return { ...state, fileList: action.payload?.fileList || [] };
    case FileActionType.SET_LOADING:
      return { ...state, isLoading: action.payload?.isLoading || false };
    case FileActionType.SET_ERRORS:
      return { ...state, errors: action.payload?.errors || [] };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [state, dispatch] = useReducer(
    FileReducer,
    FileContextInitialValues as FileContextState,
  );

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);

  if (context === undefined)
    throw new Error("useFileContext must be used within a FileProvider");

  return context;
};

export { FileProvider, useFileContext, FileActionType, FileReducer, FileContextInitialValues };
