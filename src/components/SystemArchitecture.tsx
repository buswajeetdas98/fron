import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Database, Server, Smartphone } from "lucide-react";

interface SystemArchitectureProps {
  showAnimation?: boolean;
}

const SystemArchitecture = ({
  showAnimation = true,
}: SystemArchitectureProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const dataFlowVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: showAnimation ? Infinity : 0,
        repeatType: "reverse" as const,
        repeatDelay: 2,
      },
    },
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Germany Meds System Architecture
        </h2>

        <motion.div
          className="relative h-[400px] w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Frontend Layer */}
          <motion.div
            className="absolute top-0 left-0 w-full flex justify-center"
            variants={itemVariants}
          >
            <Card className="bg-blue-50 border-blue-200 w-64 p-4">
              <div className="flex flex-col items-center gap-2">
                <Smartphone className="h-10 w-10 text-blue-500" />
                <h3 className="font-medium">React Frontend</h3>
                <p className="text-xs text-center text-gray-600">
                  User Interface, State Management, API Integration
                </p>
              </div>
            </Card>
          </motion.div>

          {/* API Layer */}
          <motion.div
            className="absolute top-[150px] left-0 w-full flex justify-center"
            variants={itemVariants}
          >
            <Card className="bg-green-50 border-green-200 w-64 p-4">
              <div className="flex flex-col items-center gap-2">
                <Server className="h-10 w-10 text-green-500" />
                <h3 className="font-medium">Django API Layer</h3>
                <p className="text-xs text-center text-gray-600">
                  Business Logic, Authentication, Data Processing
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Database Layer */}
          <motion.div
            className="absolute bottom-0 left-0 w-full flex justify-center"
            variants={itemVariants}
          >
            <Card className="bg-purple-50 border-purple-200 w-64 p-4">
              <div className="flex flex-col items-center gap-2">
                <Database className="h-10 w-10 text-purple-500" />
                <h3 className="font-medium">SQLite Database</h3>
                <p className="text-xs text-center text-gray-600">
                  Data Storage, Inventory, Transactions
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Connection Lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: -1 }}
          >
            {/* Frontend to API */}
            <motion.path
              d="M 320,80 L 320,150"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
            />

            {/* API to Database */}
            <motion.path
              d="M 320,220 L 320,300"
              stroke="#8b5cf6"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
            />

            {/* Database to API */}
            <motion.path
              d="M 340,300 L 340,220"
              stroke="#8b5cf6"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
            />

            {/* API to Frontend */}
            <motion.path
              d="M 340,150 L 340,80"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
            />
          </svg>

          {/* Data Flow Animations */}
          <motion.div
            className="absolute top-[100px] left-[325px] bg-blue-500 h-3 w-3 rounded-full"
            variants={dataFlowVariants}
          />

          <motion.div
            className="absolute top-[250px] left-[325px] bg-purple-500 h-3 w-3 rounded-full"
            variants={dataFlowVariants}
          />

          <motion.div
            className="absolute top-[250px] left-[335px] bg-purple-500 h-3 w-3 rounded-full"
            variants={dataFlowVariants}
            initial={{ x: 20, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.5,
                repeat: showAnimation ? Infinity : 0,
                repeatType: "reverse",
                repeatDelay: 2,
                delay: 1,
              },
            }}
          />

          <motion.div
            className="absolute top-[100px] left-[335px] bg-blue-500 h-3 w-3 rounded-full"
            variants={dataFlowVariants}
            initial={{ x: 20, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.5,
                repeat: showAnimation ? Infinity : 0,
                repeatType: "reverse",
                repeatDelay: 2,
                delay: 1,
              },
            }}
          />
        </motion.div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="text-center">
            The architecture demonstrates how data flows between the React
            frontend, Django API layer, and SQLite database.
          </p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 h-3 w-3 rounded-full"></div>
              <span>API Requests/Responses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-500 h-3 w-3 rounded-full"></div>
              <span>Database Queries/Results</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemArchitecture;
