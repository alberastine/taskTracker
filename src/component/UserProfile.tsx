import { RxAvatar } from "react-icons/rx";
import WidgetWrapper from "./WidgetWrapper";
import "../styles/components/UserProfile.css";
import { Card } from "flowbite-react";

const UserProfile = () => {
  return (
    <WidgetWrapper>
      <div className="user-profile-container">
        <div className="user-profile-left">
          <div className="user-profile-header">
            <div className="user-profile-avatar">
              <RxAvatar size={200} />
              <p>Account</p>
            </div>
            <div className="user-profile-info">
              <h2>John Doe</h2>
              <p>john.doe@example.com</p>
            </div>
          </div>
          <div className="user-profile-body-container">
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p>Username</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p>Email</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p>Password</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
            <div className="user-profile-body">
              <div className="user-profile-body-label">
                <p>Full name</p>
              </div>
              <div className="user-profile-body-input-container">
                <input className="user-profile-body-input" />
              </div>
            </div>
          </div>
        </div>
        <div className="user-profile-right">
          <Card className="max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Latest Customers
              </h5>
              <a
                href="#"
                className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Neil Sims
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        email@windster.com
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      $320
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Bonnie Green
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        email@windster.com
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      $3467
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Michael Gough
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        email@windster.com
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      $67
                    </div>
                  </div>
                </li>
                <li className="py-3 sm:py-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Lana Byrd
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        email@windster.com
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      $367
                    </div>
                  </div>
                </li>
                <li className="pb-0 pt-3 sm:pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Thomes Lean
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        email@windster.com
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      $2367
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </WidgetWrapper>
  );
};

export default UserProfile;
