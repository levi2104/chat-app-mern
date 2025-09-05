/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";

const RenameGroupModal = ({
  isOpen,
  newGroupName,
  setNewGroupName,
  handleRenameGroup,
  setRenameModalOpen,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[5px] shadow-lg w-[350px] relative p-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <h2 className="text-xl font-semibold mb-4">Rename Group</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 outline-none bg-white"
            />
            <div className="flex justify-center gap-2">
              <button
                onClick={handleRenameGroup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                Rename Group
              </button>
              <button
                onClick={() => {
                  setRenameModalOpen(false);
                  setNewGroupName("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RenameGroupModal;